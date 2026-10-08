import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";

type Level = "L" | "M" | "Q" | "H";

type Settings = {
  text: string;
  fg: string;
  bg: string;
  size: number;
  ecl: Level;
};

const STORAGE_KEY = "pressmark.v1";
const SIZE_MIN = 160;
const SIZE_MAX = 640;
const SIZE_STEP = 16;
const DEFAULT_SIZE = 320;

const LEVELS: { id: Level; name: string; recovery: string; hint: string }[] = [
  {
    id: "L",
    name: "Low",
    recovery: "7%",
    hint: "Low recovers about 7% of a damaged code and fits the most text.",
  },
  {
    id: "M",
    name: "Medium",
    recovery: "15%",
    hint: "Medium recovers about 15%. A solid default for links and short notes.",
  },
  {
    id: "Q",
    name: "Quartile",
    recovery: "25%",
    hint: "Quartile recovers about 25%. Useful if the code might get scratched or covered.",
  },
  {
    id: "H",
    name: "High",
    recovery: "30%",
    hint: "High recovers about 30%, but it holds the least text.",
  },
];

const EXAMPLES = [
  { label: "Website", value: "https://example.com" },
  { label: "Note", value: "Meet me at the north gate at 6" },
];

function parseHex(input: string): string | null {
  const raw = input.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(raw)) {
    const expanded = raw
      .split("")
      .map((channel) => channel + channel)
      .join("");
    return `#${expanded.toLowerCase()}`;
  }
  if (/^[0-9a-fA-F]{6}$/.test(raw)) return `#${raw.toLowerCase()}`;
  return null;
}

function snapSize(value: number) {
  if (!Number.isFinite(value)) return DEFAULT_SIZE;
  const clamped = Math.min(SIZE_MAX, Math.max(SIZE_MIN, value));
  const steps = Math.round((clamped - SIZE_MIN) / SIZE_STEP);
  return SIZE_MIN + steps * SIZE_STEP;
}

function hexToRgb(hex: string): [number, number, number] | null {
  const parsed = parseHex(hex);
  if (!parsed) return null;
  const n = Number.parseInt(parsed.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function channelLuminance(channel: number) {
  const s = channel / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function contrastRatio(foreground: string, background: string) {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);
  if (!fg || !bg) return null;
  const l1 =
    0.2126 * channelLuminance(fg[0]) +
    0.7152 * channelLuminance(fg[1]) +
    0.0722 * channelLuminance(fg[2]);
  const l2 =
    0.2126 * channelLuminance(bg[0]) +
    0.7152 * channelLuminance(bg[1]) +
    0.0722 * channelLuminance(bg[2]);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function friendlyError(err: unknown) {
  const message = err instanceof Error ? err.message : "";
  if (/too big|too large|cannot contain|capacity/i.test(message)) {
    return "That text is too long for this error correction level. Shorten it, or switch to Low.";
  }
  return "Could not make a code from that text.";
}

function readSettings(): Settings | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<Settings>;
    if (typeof data.text !== "string" || typeof data.size !== "number") return null;
    const fg = typeof data.fg === "string" ? parseHex(data.fg) : null;
    const bg = typeof data.bg === "string" ? parseHex(data.bg) : null;
    if (!fg || !bg) return null;
    if (data.ecl !== "L" && data.ecl !== "M" && data.ecl !== "Q" && data.ecl !== "H") {
      return null;
    }
    return { text: data.text, fg, bg, size: snapSize(data.size), ecl: data.ecl };
  } catch {
    return null;
  }
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

function ColorField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-fg">
        {label}
      </label>
      <div className="mt-2 flex items-center gap-2">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value.toLowerCase())}
          className="swatch"
        />
        <input
          id={`${id}-hex`}
          aria-label={`${label} hex value`}
          value={draft}
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
          onChange={(event) => {
            const next = event.target.value;
            setDraft(next);
            const parsed = parseHex(next);
            if (parsed) onChange(parsed);
          }}
          onBlur={() => setDraft(value)}
          className="h-11 w-full rounded-sm border border-border bg-stage px-3 text-base tracking-wide text-fg uppercase"
        />
      </div>
    </div>
  );
}

export function QrMaker() {
  const [text, setText] = useState("");
  const [fg, setFg] = useState("#141210");
  const [bg, setBg] = useState("#ffffff");
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [ecl, setEcl] = useState<Level>("M");
  const [hydrated, setHydrated] = useState(false);
  const [svgUrl, setSvgUrl] = useState<string | null>(null);
  const [version, setVersion] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const requestId = useRef(0);

  useEffect(() => {
    const saved = readSettings();
    if (saved) {
      setText(saved.text);
      setFg(saved.fg);
      setBg(saved.bg);
      setSize(saved.size);
      setEcl(saved.ecl);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const settings: Settings = { text, fg, bg, size, ecl };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [hydrated, text, fg, bg, size, ecl]);

  useEffect(() => {
    const value = text.trim();
    if (!value) {
      setSvgUrl(null);
      setVersion(null);
      setError(null);
      return;
    }

    const id = ++requestId.current;
    let cancelled = false;

    void (async () => {
      try {
        const mod = await import("qrcode");
        const created = mod.default.create(value, { errorCorrectionLevel: ecl });
        const svg = await mod.default.toString(value, {
          type: "svg",
          errorCorrectionLevel: ecl,
          margin: 4,
          color: { dark: fg, light: bg },
        });
        if (cancelled || id !== requestId.current) return;
        setSvgUrl(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
        setVersion(created.version);
        setError(null);
      } catch (err) {
        if (cancelled || id !== requestId.current) return;
        setSvgUrl(null);
        setVersion(null);
        setError(friendlyError(err));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [text, fg, bg, ecl]);

  const ratio = contrastRatio(fg, bg);
  const lowContrast = ratio !== null && ratio < 3;
  const level = LEVELS.find((item) => item.id === ecl) ?? LEVELS[1];
  const previewLabel = text.trim()
    ? `QR code for ${text.trim().slice(0, 140)}`
    : "QR code preview";

  async function download() {
    const value = text.trim();
    if (!value || error || downloading) return;
    setDownloading(true);
    try {
      const mod = await import("qrcode");
      const url = await mod.default.toDataURL(value, {
        errorCorrectionLevel: ecl,
        margin: 4,
        width: size,
        color: { dark: fg, light: bg },
      });
      const link = document.createElement("a");
      link.href = url;
      link.download = "pressmark-qr.png";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setDownloading(false);
    }
  }

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
            Type a URL or any text. Colors, size, and error correction update the preview immediately.
          </p>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:mt-10 lg:grid-cols-5 lg:gap-12">
          <form
            className="order-2 flex flex-col gap-8 lg:order-1 lg:col-span-3"
            onSubmit={(event) => event.preventDefault()}
          >
            <div>
              <label htmlFor="payload" className="text-sm font-medium text-fg">
                URL or text
              </label>
              <textarea
                id="payload"
                name="payload"
                value={text}
                rows={4}
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="none"
                placeholder="https://example.com"
                aria-describedby="payload-hint"
                onChange={(event) => setText(event.target.value)}
                className="mt-2 min-h-28 w-full resize-y rounded-sm border border-border bg-stage px-3 py-3 text-base text-fg placeholder:text-muted"
              />
              <div className="mt-2 flex items-center justify-between gap-3">
                <p id="payload-hint" className="text-sm text-muted">
                  Updates as you type.
                </p>
                <p className="text-sm text-muted tabular-nums">{text.length} characters</p>
              </div>
              <div className="mt-3">
                <p id="examples-label" className="text-sm text-muted">
                  Examples
                </p>
                <div
                  role="group"
                  aria-labelledby="examples-label"
                  className="mt-2 flex flex-wrap gap-2"
                >
                  {EXAMPLES.map((example) => (
                    <button
                      key={example.label}
                      type="button"
                      onClick={() => {
                        setText(example.value);
                        document.getElementById("payload")?.focus();
                      }}
                      className="h-11 rounded-sm border border-border bg-stage px-3 text-sm font-medium text-fg transition-colors duration-150 hover:border-fg"
                    >
                      {example.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <fieldset>
              <legend className="text-sm font-medium text-fg">Colors</legend>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <ColorField id="foreground" label="Foreground" value={fg} onChange={setFg} />
                <ColorField id="background" label="Background" value={bg} onChange={setBg} />
              </div>
              <button
                type="button"
                onClick={() => {
                  setFg(bg);
                  setBg(fg);
                }}
                className="mt-3 h-11 rounded-sm border border-border bg-stage px-3 text-sm font-medium text-fg transition-colors duration-150 hover:border-fg"
              >
                Swap colors
              </button>
            </fieldset>

            <div>
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor="size" className="text-sm font-medium text-fg">
                  Size
                </label>
                <output htmlFor="size" className="text-sm text-muted tabular-nums">
                  {size} px
                </output>
              </div>
              <input
                id="size"
                name="size"
                type="range"
                min={SIZE_MIN}
                max={SIZE_MAX}
                step={SIZE_STEP}
                value={size}
                aria-describedby="size-hint"
                onChange={(event) => setSize(snapSize(Number(event.target.value)))}
                className="mt-2 h-11 w-full accent-primary"
              />
              <p id="size-hint" className="text-sm text-muted">
                Pixel width and height of the downloaded PNG.
              </p>
            </div>

            <fieldset aria-describedby="ecl-hint">
              <legend className="text-sm font-medium text-fg">Error correction</legend>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {LEVELS.map((item) => {
                  const selected = item.id === ecl;
                  return (
                    <label
                      key={item.id}
                      className={`flex min-h-16 cursor-pointer flex-col items-center justify-center rounded-sm border px-1 py-2 text-center transition-colors duration-150 ${
                        selected
                          ? "border-primary bg-primary text-primary-fg"
                          : "border-border bg-stage text-fg hover:border-fg"
                      }`}
                    >
                      <input
                        type="radio"
                        name="error-correction"
                        value={item.id}
                        checked={selected}
                        aria-label={`${item.name} error correction, about ${item.recovery} recovery`}
                        onChange={() => setEcl(item.id)}
                        className="sr-only"
                      />
                      <span className="text-sm font-semibold">{item.id}</span>
                      <span
                        className={`text-xs tabular-nums ${selected ? "text-primary-fg" : "text-muted"}`}
                      >
                        {item.recovery}
                      </span>
                    </label>
                  );
                })}
              </div>
              <p id="ecl-hint" className="mt-3 text-sm text-muted">
                {level.hint}
              </p>
            </fieldset>
          </form>

          <aside className="order-1 lg:sticky lg:top-8 lg:order-2 lg:col-span-2 lg:self-start">
            <div className="rounded-lg border border-border bg-surface p-5">
              <h2 className="text-sm font-medium text-fg">Preview</h2>
              <div className="mx-auto mt-4 w-full max-w-72">
                <div className="aspect-square w-full overflow-hidden rounded-sm border border-border bg-stage">
                  {error ? (
                    <p
                      role="alert"
                      className="flex h-full items-center justify-center p-4 text-center text-sm text-fg"
                    >
                      {error}
                    </p>
                  ) : svgUrl ? (
                    <img src={svgUrl} alt={previewLabel} className="h-full w-full" />
                  ) : (
                    <p className="flex h-full items-center justify-center p-4 text-center text-sm text-muted">
                      The code appears as you type.
                    </p>
                  )}
                </div>
              </div>
              <p aria-live="polite" className="mt-4 text-center text-sm text-muted">
                {error
                  ? ""
                  : svgUrl && version
                    ? `Version ${version} · saves at ${size}×${size}`
                    : "Waiting for text"}
              </p>
              {lowContrast && svgUrl ? (
                <p role="status" className="mt-2 text-center text-sm text-fg">
                  These colors are very close. A scanner may not read the code.
                </p>
              ) : null}
              <button
                type="button"
                onClick={() => void download()}
                disabled={!svgUrl || Boolean(error) || downloading}
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-fg transition-opacity duration-150 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Download aria-hidden className="size-4" />
                {downloading ? "Preparing PNG…" : "Download PNG"}
              </button>
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
