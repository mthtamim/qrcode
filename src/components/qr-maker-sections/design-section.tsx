import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { useQrStore } from "@/lib/store/qr-store";

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
  if (!Number.isFinite(value)) return 320;
  const clamped = Math.min(640, Math.max(160, value));
  const steps = Math.round((clamped - 160) / 16);
  return 160 + steps * 16;
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
          onChange={(event) => {
            const val = event.target.value.toLowerCase();
            onChange(val);
            setDraft(val);
          }}
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

const LEVELS = [
  { id: "L", name: "Low", recovery: "7%" },
  { id: "M", name: "Medium", recovery: "15%" },
  { id: "Q", name: "Quartile", recovery: "25%" },
  { id: "H", name: "High", recovery: "30%" },
] as const;

export function DesignSection() {
  const store = useQrStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        store.setDesign({ logoUrl: event.target?.result as string, ecl: "H" }); // auto set to high ecl when logo is used
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-surface p-5 space-y-6">

      <div>
        <h2 className="text-sm font-medium text-fg mb-4">Colors & Gradients</h2>

        <div className="mb-4">
          <label className="text-xs text-muted mb-2 block">Fill Type</label>
          <div className="flex gap-2">
            {(["none", "linear", "radial"] as const).map((type) => (
              <button
                key={type}
                onClick={() => store.setDesign({ gradientType: type })}
                className={`px-3 py-1.5 text-xs rounded-sm transition-colors ${
                  store.gradientType === type ? "bg-primary text-primary-fg" : "bg-stage border border-border text-fg hover:border-fg"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <ColorField id="fg1" label={store.gradientType === "none" ? "Foreground" : "Gradient Start"} value={store.fg1} onChange={(v) => store.setDesign({ fg1: v })} />
          {store.gradientType !== "none" && (
            <ColorField id="fg2" label="Gradient End" value={store.fg2} onChange={(v) => store.setDesign({ fg2: v })} />
          )}
          <ColorField id="bg" label="Background" value={store.bg} onChange={(v) => store.setDesign({ bg: v })} />
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h2 className="text-sm font-medium text-fg mb-4">Shapes</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="text-xs text-muted mb-2 block">Dots Shape</label>
            <div className="flex gap-2">
              {(["square", "dots", "rounded"] as const).map((shape) => (
                <button
                  key={shape}
                  onClick={() => store.setDesign({ moduleShape: shape })}
                  className={`px-3 py-1.5 text-xs rounded-sm transition-colors ${
                    store.moduleShape === shape ? "bg-primary text-primary-fg" : "bg-stage border border-border text-fg hover:border-fg"
                  }`}
                >
                  {shape.charAt(0).toUpperCase() + shape.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted mb-2 block">Finder Shape</label>
            <div className="flex gap-2">
              {(["square", "dots", "rounded"] as const).map((shape) => (
                <button
                  key={shape}
                  onClick={() => store.setDesign({ finderShape: shape })}
                  className={`px-3 py-1.5 text-xs rounded-sm transition-colors ${
                    store.finderShape === shape ? "bg-primary text-primary-fg" : "bg-stage border border-border text-fg hover:border-fg"
                  }`}
                >
                  {shape.charAt(0).toUpperCase() + shape.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h2 className="text-sm font-medium text-fg mb-4">Center Logo</h2>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleLogoUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 h-11 px-4 rounded-sm border border-border bg-stage text-sm text-fg hover:border-fg transition-colors"
          >
            <Upload className="size-4" />
            Upload Logo
          </button>

          {store.logoUrl && (
            <div className="flex items-center gap-2">
              <img src={store.logoUrl} alt="Logo preview" className="size-11 object-contain bg-white border border-border rounded-sm" />
              <button
                onClick={() => store.setDesign({ logoUrl: null })}
                className="p-2 text-muted hover:text-red-500 transition-colors"
                title="Remove logo"
              >
                <X className="size-4" />
              </button>
            </div>
          )}
        </div>
        {store.logoUrl && (
          <p className="text-xs text-muted mt-2">Error correction automatically set to High.</p>
        )}
      </div>

      <div className="border-t border-border pt-6">
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <label htmlFor="size" className="text-sm font-medium text-fg">
            Size
          </label>
          <output className="text-sm text-muted tabular-nums">
            {store.size} px
          </output>
        </div>
        <input
          id="size"
          type="range"
          min={160}
          max={640}
          step={16}
          value={store.size}
          onChange={(event) => store.setDesign({ size: snapSize(Number(event.target.value)) })}
          className="h-11 w-full accent-primary"
        />
      </div>

      <div className="border-t border-border pt-6">
        <legend className="text-sm font-medium text-fg mb-3">Error correction</legend>
        <div className="grid grid-cols-4 gap-2">
          {LEVELS.map((item) => {
            const selected = item.id === store.ecl;
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
                  onChange={() => store.setDesign({ ecl: item.id as any })}
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
      </div>

    </div>
  );
}
