import { useQrStore } from "@/lib/store/qr-store";

const EXAMPLES = [
  { label: "Website", value: "https://example.com" },
  { label: "Note", value: "Meet me at the north gate at 6" },
];

export function TemplatesSection() {
  const store = useQrStore();

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <h2 className="text-sm font-medium text-fg mb-4">Content Template</h2>

      <div className="flex flex-wrap gap-2 mb-6">
        {(["text", "wifi", "vcard", "email", "location", "batch"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => store.setDataType(type)}
            className={`px-3 py-1.5 rounded-sm text-sm font-medium transition-colors ${
              store.dataType === type
                ? "bg-primary text-primary-fg"
                : "border border-border bg-stage text-fg hover:border-fg"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex justify-end mb-2">
            <button
                type="button"
                onClick={store.clearData}
                className="text-xs text-muted hover:text-fg transition-colors"
            >
                Clear fields
            </button>
        </div>

        {store.dataType === "text" && (
          <div>
            <textarea
              value={store.text}
              rows={4}
              spellCheck={false}
              placeholder="https://example.com"
              onChange={(e) => store.setText(e.target.value)}
              className="w-full resize-y rounded-sm border border-border bg-stage px-3 py-3 text-base text-fg placeholder:text-muted"
            />
            <div className="mt-3">
              <p className="text-sm text-muted mb-2">Examples</p>
              <div className="flex gap-2">
                {EXAMPLES.map((example) => (
                  <button
                    key={example.label}
                    type="button"
                    onClick={() => store.setText(example.value)}
                    className="h-9 rounded-sm border border-border bg-stage px-3 text-xs font-medium text-fg transition-colors hover:border-fg"
                  >
                    {example.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {store.dataType === "wifi" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Network Name (SSID)</label>
              <input
                type="text"
                value={store.wifi.ssid}
                onChange={(e) => store.updateWifi({ ssid: e.target.value })}
                className="w-full h-11 rounded-sm border border-border bg-stage px-3 text-fg"
                placeholder="My WiFi Network"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Password</label>
              <input
                type="password"
                value={store.wifi.pass}
                onChange={(e) => store.updateWifi({ pass: e.target.value })}
                className="w-full h-11 rounded-sm border border-border bg-stage px-3 text-fg"
                placeholder="Secret password"
              />
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <input
                type="checkbox"
                id="hidden-wifi"
                checked={store.wifi.hidden}
                onChange={(e) => store.updateWifi({ hidden: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="hidden-wifi" className="text-sm text-fg">Hidden Network</label>
            </div>
          </div>
        )}

        {store.dataType === "vcard" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-fg mb-1">First Name</label>
              <input type="text" value={store.vcard.firstName} onChange={(e) => store.updateVCard({ firstName: e.target.value })} className="w-full h-11 rounded-sm border border-border bg-stage px-3 text-fg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Last Name</label>
              <input type="text" value={store.vcard.lastName} onChange={(e) => store.updateVCard({ lastName: e.target.value })} className="w-full h-11 rounded-sm border border-border bg-stage px-3 text-fg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Phone</label>
              <input type="tel" value={store.vcard.phone} onChange={(e) => store.updateVCard({ phone: e.target.value })} className="w-full h-11 rounded-sm border border-border bg-stage px-3 text-fg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Email</label>
              <input type="email" value={store.vcard.email} onChange={(e) => store.updateVCard({ email: e.target.value })} className="w-full h-11 rounded-sm border border-border bg-stage px-3 text-fg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Company</label>
              <input type="text" value={store.vcard.org} onChange={(e) => store.updateVCard({ org: e.target.value })} className="w-full h-11 rounded-sm border border-border bg-stage px-3 text-fg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Title</label>
              <input type="text" value={store.vcard.title} onChange={(e) => store.updateVCard({ title: e.target.value })} className="w-full h-11 rounded-sm border border-border bg-stage px-3 text-fg" />
            </div>
          </div>
        )}

        {store.dataType === "email" && (
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-fg mb-1">To Email</label>
              <input type="email" value={store.emailData.to} onChange={(e) => store.updateEmail({ to: e.target.value })} className="w-full h-11 rounded-sm border border-border bg-stage px-3 text-fg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Subject</label>
              <input type="text" value={store.emailData.subject} onChange={(e) => store.updateEmail({ subject: e.target.value })} className="w-full h-11 rounded-sm border border-border bg-stage px-3 text-fg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Body</label>
              <textarea value={store.emailData.body} rows={3} onChange={(e) => store.updateEmail({ body: e.target.value })} className="w-full rounded-sm border border-border bg-stage px-3 py-2 text-fg" />
            </div>
          </div>
        )}

        {store.dataType === "location" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Latitude</label>
              <input type="number" step="any" value={store.locationData.lat} onChange={(e) => store.updateLocation({ lat: e.target.value })} className="w-full h-11 rounded-sm border border-border bg-stage px-3 text-fg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Longitude</label>
              <input type="number" step="any" value={store.locationData.lng} onChange={(e) => store.updateLocation({ lng: e.target.value })} className="w-full h-11 rounded-sm border border-border bg-stage px-3 text-fg" />
            </div>
          </div>
        )}

        {store.dataType === "batch" && (
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Batch Items (One per line)</label>
              <textarea
                value={store.batchData.join("\n")}
                rows={6}
                spellCheck={false}
                placeholder={"https://example.com/1\nhttps://example.com/2\nhttps://example.com/3"}
                onChange={(e) => store.setBatchData(e.target.value.split("\n"))}
                className="w-full resize-y rounded-sm border border-border bg-stage px-3 py-3 text-base text-fg placeholder:text-muted"
              />
              <p className="text-xs text-muted mt-2">
                Creates multiple QR codes at once. The first item is previewed on the right.
                Downloading will generate a ZIP file containing all QR codes.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
