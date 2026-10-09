import { useEffect, useRef, useState, useMemo } from "react";
import { Download, Copy, RefreshCw, X } from "lucide-react";
import type { QRCode } from "qrcode";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useQrStore, useQrHistoryStore } from "@/lib/store/qr-store";
import {
  generateWifiString,
  generateVCardString,
  generateEmailString,
  generateLocationString,
  getDynamicFilename
} from "@/lib/qr/helpers";
import { CustomQrRenderer } from "./custom-qr-renderer";

import { DesignSection } from "./qr-maker-sections/design-section";
import { TemplatesSection } from "./qr-maker-sections/templates-section";
import { HistorySection } from "./qr-maker-sections/history-section";

const EXAMPLES = [
  { label: "Website", value: "https://example.com" },
  { label: "Note", value: "Meet me at the north gate at 6" },
];

function friendlyError(err: unknown) {
  const message = err instanceof Error ? err.message : "";
  if (/too big|too large|cannot contain|capacity/i.test(message)) {
    return "That text is too long for this error correction level. Shorten it, or switch to Low.";
  }
  return "Could not make a code from that text.";
}

function FinderMark() {
  const cells = [1, 1, 1, 1, 0, 1, 1, 1, 1];
  return (
    <span
      aria-hidden
      className="grid size-8 shrink-0 grid-cols-3 gap-0.5 rounded-sm bg-primary p-1"
    >
      {cells.map((on, index) => (
        <span key={index} className={on ? "bg-primary-fg" : "bg-transparent"} />
      ))}
    </span>
  );
}

export function QrMaker() {
  const store = useQrStore();
  const historyStore = useQrHistoryStore();

  // Compute final payload based on selected type
  const payload = useMemo(() => {
    switch (store.dataType) {
      case "text":
        return store.text;
      case "wifi":
        return generateWifiString(store.wifi.ssid, store.wifi.pass, store.wifi.hidden);
      case "vcard":
        return generateVCardString(store.vcard);
      case "email":
        return generateEmailString(store.emailData.to, store.emailData.subject, store.emailData.body);
      case "location":
        return generateLocationString(parseFloat(store.locationData.lat) || 0, parseFloat(store.locationData.lng) || 0);
      case "batch":
        const validBatch = store.batchData.filter(line => line.trim().length > 0);
        return validBatch.length > 0 ? validBatch[0] : "";
      default:
        return store.text;
    }
  }, [store.dataType, store.text, store.wifi, store.vcard, store.emailData, store.locationData, store.batchData]);

  // Debounce the payload heavily to avoid stuttering on massive text
  const debouncedPayload = useDebounce(payload.trim(), 300);

  const [qrCode, setQrCode] = useState<QRCode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!debouncedPayload) {
      setQrCode(null);
      setError(null);
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const mod = await import("qrcode");
        const created = mod.default.create(debouncedPayload, { errorCorrectionLevel: store.ecl });
        if (cancelled) return;
        setQrCode(created);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setQrCode(null);
        setError(friendlyError(err));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debouncedPayload, store.ecl]);

  const previewLabel = debouncedPayload
    ? `QR code for ${debouncedPayload.slice(0, 140)}`
    : "QR code preview";

  const getSvgString = () => {
    if (!wrapperRef.current) return null;
    const svg = wrapperRef.current.querySelector("svg");
    if (!svg) return null;
    const serializer = new XMLSerializer();
    return serializer.serializeToString(svg);
  };

  const getCanvas = async (): Promise<HTMLCanvasElement | null> => {
    const svgString = getSvgString();
    if (!svgString) return null;

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = store.size;
        canvas.height = store.size;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
        }
        resolve(canvas);
      };
      img.onerror = (err) => {
        console.error("Failed to load SVG as image", err);
        resolve(null);
      };
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
    });
  };

  const createSvgNode = async (text: string) => {
    // Generate QR logic manually for batch
    const mod = await import("qrcode");
    const created = mod.default.create(text, { errorCorrectionLevel: store.ecl });
    // This is complex to render a react component to string for each batch item.
    // Let's use qrcode's native toString for batch SVGs as a simplification.
    return mod.default.toString(text, {
      type: "svg",
      errorCorrectionLevel: store.ecl,
      margin: 4,
      width: store.size,
      color: { dark: store.fg1, light: store.bg } // simplistic colors for batch fallback
    });
  };

  const downloadBatch = async (ext: "png" | "svg") => {
    if (store.batchData.length === 0) return;
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    const mod = await import("qrcode");

    const validBatch = store.batchData.filter(line => line.trim().length > 0);
    for (let i = 0; i < validBatch.length; i++) {
        const text = validBatch[i];
        if (!text) continue;
        // avoid collision with an index suffix
        const rawFilename = getDynamicFilename(text, ext);
        const parts = rawFilename.split('.');
        const filename = parts.length > 1 ? `${parts[0]}-${i + 1}.${parts[1]}` : `${rawFilename}-${i + 1}`;
        if (ext === "svg") {
            const svgString = await mod.default.toString(text, {
              type: "svg",
              errorCorrectionLevel: store.ecl,
              margin: 4,
              width: store.size,
              color: { dark: store.fg1, light: store.bg }
            });
            zip.file(filename, svgString);
        } else {
            const dataUrl = await mod.default.toDataURL(text, {
                errorCorrectionLevel: store.ecl,
                margin: 4,
                width: store.size,
                color: { dark: store.fg1, light: store.bg }
            });
            const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
            zip.file(filename, base64Data, { base64: true });
        }
    }

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pressmark-batch.zip";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    saveToHistory();
  }

  const downloadPng = async () => {
    if (store.dataType === "batch") {
      await downloadBatch("png");
      return;
    }
    const canvas = await getCanvas();
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = getDynamicFilename(debouncedPayload, "png");
    document.body.appendChild(link);
    link.click();
    link.remove();

    saveToHistory();
  };

  const downloadSvg = () => {
    if (store.dataType === "batch") {
      void downloadBatch("svg");
      return;
    }
    const svgString = getSvgString();
    if (!svgString) return;

    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = getDynamicFilename(debouncedPayload, "svg");
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    saveToHistory();
  };

  const copyImage = async () => {
    const canvas = await getCanvas();
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ]);
        alert("Copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy image", err);
        alert("Failed to copy image to clipboard.");
      }
    });
  };

  const saveToHistory = () => {
    if (!debouncedPayload) return;
    historyStore.addHistory({
      id: crypto.randomUUID(),
      date: Date.now(),
      text: debouncedPayload,
      config: {
        text: store.text,
        dataType: store.dataType,
        wifi: store.wifi,
        vcard: store.vcard,
        emailData: store.emailData,
        locationData: store.locationData,
        batchData: store.batchData,
        fg1: store.fg1,
        fg2: store.fg2,
        bg: store.bg,
        size: store.size,
        ecl: store.ecl,
        gradientType: store.gradientType,
        moduleShape: store.moduleShape,
        finderShape: store.finderShape,
        logoUrl: store.logoUrl,
      }
    });
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <FinderMark />
            <p className="font-display text-xl font-semibold tracking-tight text-fg">Pressmark</p>
          </div>
          <p className="text-sm text-muted">Live preview</p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
        <div className="max-w-xl">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-fg sm:text-5xl">
            Make a QR code
          </h1>
          <p className="mt-3 text-base text-muted">
            Choose a template, design it, and download. Colors, shapes, and logos update immediately.
          </p>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:mt-10 lg:grid-cols-5 lg:gap-12">
          <div className="order-2 flex flex-col gap-8 lg:order-1 lg:col-span-3">
            <TemplatesSection />
            <DesignSection />
            <HistorySection />
          </div>

          <aside className="order-1 lg:sticky lg:top-8 lg:order-2 lg:col-span-2 lg:self-start">
            <div className="rounded-lg border border-border bg-surface p-5">
              <h2 className="text-sm font-medium text-fg flex justify-between">
                Preview
              </h2>
              <div className="mx-auto mt-4 w-full max-w-72">
                <div className="aspect-square w-full overflow-hidden rounded-sm border border-border bg-stage flex items-center justify-center">
                  {error ? (
                    <p
                      role="alert"
                      className="p-4 text-center text-sm text-fg"
                    >
                      {error}
                    </p>
                  ) : qrCode ? (
                    <div ref={wrapperRef} className="w-full h-full flex items-center justify-center p-4">
                       <CustomQrRenderer
                         qr={qrCode}
                         fg1={store.fg1}
                         fg2={store.fg2}
                         bg={store.bg}
                         size={store.size}
                         gradientType={store.gradientType}
                         moduleShape={store.moduleShape}
                         finderShape={store.finderShape}
                         logoUrl={store.logoUrl}
                       />
                    </div>
                  ) : (
                    <p className="p-4 text-center text-sm text-muted">
                      The code appears as you type.
                    </p>
                  )}
                </div>
              </div>
              <p aria-live="polite" className="mt-4 text-center text-sm text-muted break-all">
                {error
                  ? ""
                  : qrCode
                    ? `Version ${qrCode.version} · saves at ${store.size}×${store.size}`
                    : "Waiting for text"}
              </p>

              <div className="mt-6 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={downloadPng}
                  disabled={!qrCode || Boolean(error)}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-fg transition-opacity duration-150 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Download aria-hidden className="size-4" />
                  {store.dataType === "batch" ? "Download PNGs (ZIP)" : "Download PNG"}
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={downloadSvg}
                    disabled={!qrCode || Boolean(error)}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-medium text-fg transition-colors duration-150 hover:border-fg disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Download aria-hidden className="size-4" />
                    {store.dataType === "batch" ? "SVGs (ZIP)" : "SVG"}
                  </button>
                  <button
                    type="button"
                    onClick={copyImage}
                    disabled={!qrCode || Boolean(error)}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-medium text-fg transition-colors duration-150 hover:border-fg disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Copy aria-hidden className="size-4" />
                    Copy
                  </button>
                </div>
              </div>
              <p className="mt-3 text-center text-sm text-muted">
                The file includes a quiet margin so phones can scan it.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
