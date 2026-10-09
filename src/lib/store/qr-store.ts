import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DataType = "text" | "wifi" | "vcard" | "email" | "location" | "batch";
export type QrLevel = "L" | "M" | "Q" | "H";
export type ModuleShape = "square" | "dots" | "rounded";
export type FinderShape = "square" | "rounded" | "dots";
export type GradientType = "none" | "linear" | "radial";
export type FrameType = "none" | "scan-me-bottom";

export interface QrState {
  // Data
  dataType: DataType;
  text: string;
  wifi: { ssid: string; pass: string; hidden: boolean };
  vcard: { firstName: string; lastName: string; phone: string; email: string; org: string; title: string };
  emailData: { to: string; subject: string; body: string };
  locationData: { lat: string; lng: string };
  batchData: string[];

  // Design
  fg1: string;
  fg2: string; // Used if gradientType !== 'none'
  bg: string;
  size: number;
  ecl: QrLevel;
  gradientType: GradientType;
  moduleShape: ModuleShape;
  finderShape: FinderShape;
  frame: FrameType;

  // Logo
  logoUrl: string | null;

  // Actions
  setDataType: (type: DataType) => void;
  setText: (text: string) => void;
  updateWifi: (data: Partial<QrState["wifi"]>) => void;
  updateVCard: (data: Partial<QrState["vcard"]>) => void;
  updateEmail: (data: Partial<QrState["emailData"]>) => void;
  updateLocation: (data: Partial<QrState["locationData"]>) => void;
  setBatchData: (data: string[]) => void;

  setDesign: (data: Partial<Pick<QrState, "fg1" | "fg2" | "bg" | "size" | "ecl" | "gradientType" | "moduleShape" | "finderShape" | "frame" | "logoUrl">>) => void;

  clearData: () => void;
}

export interface QrHistoryItem {
  id: string;
  date: number;
  text: string;
  config: Omit<QrState, "setDataType" | "setText" | "updateWifi" | "updateVCard" | "updateEmail" | "updateLocation" | "setBatchData" | "setDesign" | "clearData">;
}

export interface QrHistoryState {
  history: QrHistoryItem[];
  addHistory: (item: QrHistoryItem) => void;
  removeHistory: (id: string) => void;
  clearHistory: () => void;
}

const initialDataState = {
  dataType: "text" as DataType,
  text: "",
  wifi: { ssid: "", pass: "", hidden: false },
  vcard: { firstName: "", lastName: "", phone: "", email: "", org: "", title: "" },
  emailData: { to: "", subject: "", body: "" },
  locationData: { lat: "", lng: "" },
  batchData: [],
};

const initialDesignState = {
  fg1: "#141210",
  fg2: "#3b82f6",
  bg: "#ffffff",
  size: 320,
  ecl: "M" as QrLevel,
  gradientType: "none" as GradientType,
  moduleShape: "square" as ModuleShape,
  finderShape: "square" as FinderShape,
  frame: "none" as FrameType,
  logoUrl: null,
};

export const useQrStore = create<QrState>()(
  persist(
    (set) => ({
      ...initialDataState,
      ...initialDesignState,

      setDataType: (type) => set({ dataType: type }),
      setText: (text) => set({ text }),
      updateWifi: (data) => set((state) => ({ wifi: { ...state.wifi, ...data } })),
      updateVCard: (data) => set((state) => ({ vcard: { ...state.vcard, ...data } })),
      updateEmail: (data) => set((state) => ({ emailData: { ...state.emailData, ...data } })),
      updateLocation: (data) => set((state) => ({ locationData: { ...state.locationData, ...data } })),
      setBatchData: (data) => set({ batchData: data }),

      setDesign: (data) => set((state) => ({ ...state, ...data })),

      clearData: () => set({ ...initialDataState, dataType: "text" }),
    }),
    {
      name: "pressmark-qr-state",
    }
  )
);

export const useQrHistoryStore = create<QrHistoryState>()(
  persist(
    (set) => ({
      history: [],
      addHistory: (item) =>
        set((state) => ({
          history: [item, ...state.history].slice(0, 50), // keep last 50
        })),
      removeHistory: (id) =>
        set((state) => ({
          history: state.history.filter((i) => i.id !== id),
        })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "pressmark-qr-history",
    }
  )
);
