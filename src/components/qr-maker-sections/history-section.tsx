import { Trash2, RotateCcw } from "lucide-react";
import { useQrHistoryStore, useQrStore } from "@/lib/store/qr-store";

export function HistorySection() {
  const historyStore = useQrHistoryStore();
  const store = useQrStore();

  if (historyStore.history.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-medium text-fg">History</h2>
        <button
          onClick={historyStore.clearHistory}
          className="text-xs text-muted hover:text-red-500 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        {historyStore.history.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 rounded-sm border border-border bg-stage">
            <div className="flex-1 min-w-0 mr-4">
              <p className="text-sm font-medium text-fg truncate">
                {item.text || "Empty Payload"}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted">
                  {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-surface border border-border text-muted uppercase">
                  {item.config.dataType}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  store.setDataType(item.config.dataType);
                  // Restore text based data
                  if (item.config.dataType === "text") store.setText(item.text);
                  store.updateWifi(item.config.wifi);
                  store.updateVCard(item.config.vcard);
                  store.updateEmail(item.config.emailData);
                  store.updateLocation(item.config.locationData);
                  // Restore design
                  store.setDesign({
                    fg1: item.config.fg1,
                    fg2: item.config.fg2,
                    bg: item.config.bg,
                    size: item.config.size,
                    ecl: item.config.ecl,
                    gradientType: item.config.gradientType,
                    moduleShape: item.config.moduleShape,
                    finderShape: item.config.finderShape,
                    frame: item.config.frame,
                    logoUrl: item.config.logoUrl,
                  });
                }}
                className="p-1.5 text-muted hover:text-fg hover:bg-surface rounded-sm transition-colors"
                title="Restore this configuration"
              >
                <RotateCcw className="size-4" />
              </button>
              <button
                onClick={() => historyStore.removeHistory(item.id)}
                className="p-1.5 text-muted hover:text-red-500 hover:bg-surface rounded-sm transition-colors"
                title="Delete from history"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
