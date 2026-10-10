import { o as __toESM } from "../_runtime.mjs";
import { q as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as RotateCcw, i as Trash2, n as Upload, o as Download, t as X } from "../_libs/lucide-react.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BRuXrKUU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useDebounce(value, delay) {
	const [debouncedValue, setDebouncedValue] = (0, import_react.useState)(value);
	(0, import_react.useEffect)(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);
		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);
	return debouncedValue;
}
var initialDataState = {
	dataType: "text",
	text: "",
	wifi: {
		ssid: "",
		pass: "",
		hidden: false
	},
	vcard: {
		firstName: "",
		lastName: "",
		phone: "",
		email: "",
		org: "",
		title: ""
	},
	emailData: {
		to: "",
		subject: "",
		body: ""
	},
	locationData: {
		lat: "",
		lng: ""
	},
	batchData: []
};
var initialDesignState = {
	fg1: "#141210",
	fg2: "#3b82f6",
	bg: "#ffffff",
	size: 320,
	ecl: "M",
	gradientType: "none",
	moduleShape: "square",
	finderShape: "square",
	frame: "none",
	logoUrl: null
};
var useQrStore = create()(persist((set) => ({
	...initialDataState,
	...initialDesignState,
	setDataType: (type) => set({ dataType: type }),
	setText: (text) => set({ text }),
	updateWifi: (data) => set((state) => ({ wifi: {
		...state.wifi,
		...data
	} })),
	updateVCard: (data) => set((state) => ({ vcard: {
		...state.vcard,
		...data
	} })),
	updateEmail: (data) => set((state) => ({ emailData: {
		...state.emailData,
		...data
	} })),
	updateLocation: (data) => set((state) => ({ locationData: {
		...state.locationData,
		...data
	} })),
	setBatchData: (data) => set({ batchData: data }),
	setDesign: (data) => set((state) => ({
		...state,
		...data
	})),
	clearData: () => set({
		...initialDataState,
		dataType: "text"
	})
}), { name: "pressmark-qr-state" }));
var useQrHistoryStore = create()(persist((set) => ({
	history: [],
	addHistory: (item) => set((state) => ({ history: [item, ...state.history].slice(0, 50) })),
	removeHistory: (id) => set((state) => ({ history: state.history.filter((i) => i.id !== id) })),
	clearHistory: () => set({ history: [] })
}), { name: "pressmark-qr-history" }));
function generateWifiString(ssid, password, hidden = false) {
	return `WIFI:T:${password ? "WPA" : "nopass"};S:${ssid};${password ? `P:${password};` : ""}${hidden ? "H:true;" : ""};`;
}
function generateVCardString(data) {
	const parts = [
		"BEGIN:VCARD",
		"VERSION:3.0",
		`N:${data.lastName};${data.firstName};;;`,
		`FN:${data.firstName} ${data.lastName}`
	];
	if (data.org) parts.push(`ORG:${data.org}`);
	if (data.title) parts.push(`TITLE:${data.title}`);
	if (data.phone) parts.push(`TEL;TYPE=WORK,VOICE:${data.phone}`);
	if (data.email) parts.push(`EMAIL;TYPE=PREF,INTERNET:${data.email}`);
	parts.push("END:VCARD");
	return parts.join("\n");
}
function generateEmailString(to, subject, body) {
	let str = `mailto:${to}`;
	const params = [];
	if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
	if (body) params.push(`body=${encodeURIComponent(body)}`);
	if (params.length > 0) str += `?${params.join("&")}`;
	return str;
}
function generateLocationString(lat, lng) {
	return `geo:${lat},${lng}`;
}
function getDynamicFilename(text, ext) {
	if (!text) return `qr-code.${ext}`;
	const clean = text.replace(/[^a-z0-9]/gi, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 20);
	return clean ? `${clean}-qr.${ext}` : `qr-code.${ext}`;
}
function CustomQrRenderer({ qr, fg1, fg2, bg, size, gradientType, moduleShape, finderShape, frame = "none", logoUrl }) {
	const baseMargin = 4;
	const frameBottomMargin = frame === "scan-me-bottom" ? 10 : 0;
	const frameTopMargin = frame === "scan-me-bottom" ? 2 : 0;
	const marginX = baseMargin + (frame === "scan-me-bottom" ? 2 : 0);
	const marginTop = baseMargin + frameTopMargin;
	const marginBottom = baseMargin + frameBottomMargin;
	if (!qr) return null;
	const length = qr.modules.size;
	const totalCellsX = length + 2 * marginX;
	const totalCellsY = length + marginTop + marginBottom;
	const cellSize = Math.min(size / totalCellsX, size / totalCellsY);
	const realWidth = cellSize * totalCellsX;
	const realHeight = cellSize * totalCellsY;
	const isFinder = (x, y) => {
		const s = length;
		const fw = 7;
		return x < fw && y < fw || x > s - fw - 1 && y < fw || x < fw && y > s - fw - 1;
	};
	const getPath = () => {
		let modulePath = "";
		const data = qr.modules.data;
		for (let row = 0; row < length; row++) for (let col = 0; col < length; col++) if (data[row * length + col]) {
			const x = col * cellSize;
			const y = row * cellSize;
			if (isFinder(col, row)) {} else {
				const centerStart = length * .35;
				const centerEnd = length * .65;
				if (logoUrl && col > centerStart && col < centerEnd && row > centerStart && row < centerEnd) continue;
				if (moduleShape === "square") modulePath += `M${x},${y}h${cellSize}v${cellSize}h-${cellSize}Z `;
				else if (moduleShape === "dots") {
					const r = cellSize * .45;
					const cx = x + cellSize / 2;
					const cy = y + cellSize / 2;
					modulePath += `M${cx + r},${cy}a${r},${r} 0 1,1 -${r * 2},0a${r},${r} 0 1,1 ${r * 2},0 `;
				} else if (moduleShape === "rounded") {
					const r = cellSize * .3;
					modulePath += `M${x + r},${y} h${cellSize - 2 * r} a${r},${r} 0 0,1 ${r},${r} v${cellSize - 2 * r} a${r},${r} 0 0,1 -${r},${r} h-${cellSize - 2 * r} a${r},${r} 0 0,1 -${r},-${r} v-${cellSize - 2 * r} a${r},${r} 0 0,1 ${r},-${r} Z `;
				}
			}
		}
		return modulePath;
	};
	const modulePath = getPath();
	const fillUrl = gradientType === "none" ? fg1 : `url(#fg-gradient)`;
	const renderFinder = (xOff, yOff) => {
		const fsize = cellSize * 7;
		const x = xOff * cellSize;
		const y = yOff * cellSize;
		const w = fsize;
		if (finderShape === "square") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: `M${x},${y}h${w}v${w}h-${w}Z M${x + cellSize},${y + cellSize}h${w - 2 * cellSize}v${w - 2 * cellSize}h-${w - 2 * cellSize}Z`,
			fillRule: "evenodd",
			fill: fillUrl
		});
		else if (finderShape === "dots") {
			const rOuter = cellSize * 1.5;
			const rInner = cellSize * .5;
			const outerPath = `M${x + rOuter},${y} h${w - 2 * rOuter} a${rOuter},${rOuter} 0 0 1 ${rOuter},${rOuter} v${w - 2 * rOuter} a${rOuter},${rOuter} 0 0 1 -${rOuter},${rOuter} h-${w - 2 * rOuter} a${rOuter},${rOuter} 0 0 1 -${rOuter},-${rOuter} v-${w - 2 * rOuter} a${rOuter},${rOuter} 0 0 1 ${rOuter},-${rOuter} Z`;
			const iw = w - 2 * cellSize;
			const ix = x + cellSize;
			const iy = y + cellSize;
			const innerPath = `M${ix + rInner},${iy} h${iw - 2 * rInner} a${rInner},${rInner} 0 0 1 ${rInner},${rInner} v${iw - 2 * rInner} a${rInner},${rInner} 0 0 1 -${rInner},${rInner} h-${iw - 2 * rInner} a${rInner},${rInner} 0 0 1 -${rInner},-${rInner} v-${iw - 2 * rInner} a${rInner},${rInner} 0 0 1 ${rInner},-${rInner} Z`;
			const cw = 3 * cellSize;
			const cx = x + 2 * cellSize;
			const cy = y + 2 * cellSize;
			const centerPath = finderShape === "dots" ? `M${cx + cw / 2},${cy + cw / 2} m -${cw / 2}, 0 a ${cw / 2},${cw / 2} 0 1,0 ${cw},0 a ${cw / 2},${cw / 2} 0 1,0 -${cw},0` : `M${cx + rInner},${cy} h${cw - 2 * rInner} a${rInner},${rInner} 0 0 1 ${rInner},${rInner} v${cw - 2 * rInner} a${rInner},${rInner} 0 0 1 -${rInner},${rInner} h-${cw - 2 * rInner} a${rInner},${rInner} 0 0 1 -${rInner},-${rInner} v-${cw - 2 * rInner} a${rInner},${rInner} 0 0 1 ${rInner},-${rInner} Z`;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: `${outerPath} ${innerPath} ${centerPath}`,
				fillRule: "evenodd",
				fill: fillUrl
			});
		} else if (finderShape === "rounded") {
			const rOuter = cellSize * 2;
			const rInner = cellSize * 1;
			const outerPath = `M${x + rOuter},${y} h${w - 2 * rOuter} a${rOuter},${rOuter} 0 0 1 ${rOuter},${rOuter} v${w - 2 * rOuter} a${rOuter},${rOuter} 0 0 1 -${rOuter},${rOuter} h-${w - 2 * rOuter} a${rOuter},${rOuter} 0 0 1 -${rOuter},-${rOuter} v-${w - 2 * rOuter} a${rOuter},${rOuter} 0 0 1 ${rOuter},-${rOuter} Z`;
			const iw = w - 2 * cellSize;
			const ix = x + cellSize;
			const iy = y + cellSize;
			const innerPath = `M${ix + rInner},${iy} h${iw - 2 * rInner} a${rInner},${rInner} 0 0 1 ${rInner},${rInner} v${iw - 2 * rInner} a${rInner},${rInner} 0 0 1 -${rInner},${rInner} h-${iw - 2 * rInner} a${rInner},${rInner} 0 0 1 -${rInner},-${rInner} v-${iw - 2 * rInner} a${rInner},${rInner} 0 0 1 ${rInner},-${rInner} Z`;
			const cw = 3 * cellSize;
			const cx = x + 2 * cellSize;
			const cy = y + 2 * cellSize;
			const centerPath = `M${cx + rInner},${cy} h${cw - 2 * rInner} a${rInner},${rInner} 0 0 1 ${rInner},${rInner} v${cw - 2 * rInner} a${rInner},${rInner} 0 0 1 -${rInner},${rInner} h-${cw - 2 * rInner} a${rInner},${rInner} 0 0 1 -${rInner},-${rInner} v-${cw - 2 * rInner} a${rInner},${rInner} 0 0 1 ${rInner},-${rInner} Z`;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: `${outerPath} ${innerPath} ${centerPath}`,
				fillRule: "evenodd",
				fill: fillUrl
			});
		}
	};
	const innerSize = length * cellSize;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		width: realWidth,
		height: realHeight,
		viewBox: `-${marginX * cellSize} -${marginTop * cellSize} ${realWidth} ${realHeight}`,
		fill: "none",
		shapeRendering: "crispEdges",
		className: "w-full h-auto max-w-full",
		style: {
			backgroundColor: bg,
			maxWidth: "100%",
			height: "auto"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [gradientType === "linear" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
				id: "fg-gradient",
				x1: "0",
				y1: "0",
				x2: "1",
				y2: "1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "0%",
					stopColor: fg1
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "100%",
					stopColor: fg2
				})]
			}), gradientType === "radial" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("radialGradient", {
				id: "fg-gradient",
				cx: "50%",
				cy: "50%",
				r: "50%",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "0%",
					stopColor: fg1
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "100%",
					stopColor: fg2
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: -marginX * cellSize,
				y: -marginTop * cellSize,
				width: realWidth,
				height: realHeight,
				fill: bg
			}),
			frame === "scan-me-bottom" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: (-marginX + 1) * cellSize,
					y: (-marginTop + 1) * cellSize,
					width: realWidth - 2 * cellSize,
					height: realHeight - 2 * cellSize,
					fill: "none",
					stroke: fillUrl,
					strokeWidth: cellSize * .5,
					rx: cellSize * 2
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: (-marginX + 1) * cellSize,
					y: length * cellSize + baseMargin * cellSize,
					width: realWidth - 2 * cellSize,
					height: (frameBottomMargin - baseMargin - 1) * cellSize,
					fill: fillUrl,
					rx: cellSize * 2
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: realWidth / 2 - marginX * cellSize,
					y: length * cellSize + baseMargin * cellSize + (frameBottomMargin - baseMargin - 1) * cellSize / 2,
					fill: bg,
					fontSize: cellSize * 3,
					fontWeight: "bold",
					fontFamily: "sans-serif",
					textAnchor: "middle",
					dominantBaseline: "middle",
					children: "SCAN ME"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: modulePath,
				fill: fillUrl
			}),
			renderFinder(0, 0),
			renderFinder(length - 7, 0),
			renderFinder(0, length - 7),
			logoUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("image", {
				href: logoUrl,
				x: innerSize * .35,
				y: innerSize * .35,
				width: innerSize * .3,
				height: innerSize * .3,
				preserveAspectRatio: "xMidYMid slice"
			})
		]
	});
}
function parseHex(input) {
	const raw = input.trim().replace(/^#/, "");
	if (/^[0-9a-fA-F]{3}$/.test(raw)) return `#${raw.split("").map((channel) => channel + channel).join("").toLowerCase()}`;
	if (/^[0-9a-fA-F]{6}$/.test(raw)) return `#${raw.toLowerCase()}`;
	return null;
}
function snapSize(value) {
	if (!Number.isFinite(value)) return 320;
	return 160 + Math.round((Math.min(640, Math.max(160, value)) - 160) / 16) * 16;
}
function ColorField({ id, label, value, onChange }) {
	const [draft, setDraft] = (0, import_react.useState)(value);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		htmlFor: id,
		className: "text-sm font-medium text-fg",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-2 flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			id,
			type: "color",
			value,
			onChange: (event) => {
				const val = event.target.value.toLowerCase();
				onChange(val);
				setDraft(val);
			},
			className: "swatch"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			id: `${id}-hex`,
			"aria-label": `${label} hex value`,
			value: draft,
			spellCheck: false,
			autoCapitalize: "none",
			autoCorrect: "off",
			onChange: (event) => {
				const next = event.target.value;
				setDraft(next);
				const parsed = parseHex(next);
				if (parsed) onChange(parsed);
			},
			onBlur: () => setDraft(value),
			className: "h-11 w-full rounded-sm border border-border bg-stage px-3 text-base tracking-wide text-fg uppercase"
		})]
	})] });
}
var LEVELS = [
	{
		id: "L",
		name: "Low",
		recovery: "7%"
	},
	{
		id: "M",
		name: "Medium",
		recovery: "15%"
	},
	{
		id: "Q",
		name: "Quartile",
		recovery: "25%"
	},
	{
		id: "H",
		name: "High",
		recovery: "30%"
	}
];
function DesignSection() {
	const store = useQrStore();
	const fileInputRef = (0, import_react.useRef)(null);
	const handleLogoUpload = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				store.setDesign({
					logoUrl: event.target?.result,
					ecl: "H"
				});
			};
			reader.readAsDataURL(file);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-surface p-5 space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium text-fg mb-4",
					children: "Colors & Gradients"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted mb-2 block",
						children: "Fill Type"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2",
						children: [
							"none",
							"linear",
							"radial"
						].map((type) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => store.setDesign({ gradientType: type }),
							className: `px-3 py-1.5 text-xs rounded-sm transition-colors ${store.gradientType === type ? "bg-primary text-primary-fg" : "bg-stage border border-border text-fg hover:border-fg"}`,
							children: type.charAt(0).toUpperCase() + type.slice(1)
						}, type))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
							id: "fg1",
							label: store.gradientType === "none" ? "Foreground" : "Gradient Start",
							value: store.fg1,
							onChange: (v) => store.setDesign({ fg1: v })
						}),
						store.gradientType !== "none" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
							id: "fg2",
							label: "Gradient End",
							value: store.fg2,
							onChange: (v) => store.setDesign({ fg2: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
							id: "bg",
							label: "Background",
							value: store.bg,
							onChange: (v) => store.setDesign({ bg: v })
						})
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border pt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium text-fg mb-4",
					children: "Shapes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted mb-2 block",
							children: "Dots"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col gap-2",
							children: [
								"square",
								"dots",
								"rounded"
							].map((shape) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => store.setDesign({ moduleShape: shape }),
								className: `px-3 py-1.5 text-xs rounded-sm transition-colors ${store.moduleShape === shape ? "bg-primary text-primary-fg" : "bg-stage border border-border text-fg hover:border-fg"}`,
								children: shape.charAt(0).toUpperCase() + shape.slice(1)
							}, shape))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted mb-2 block",
							children: "Finder"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col gap-2",
							children: [
								"square",
								"dots",
								"rounded"
							].map((shape) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => store.setDesign({ finderShape: shape }),
								className: `px-3 py-1.5 text-xs rounded-sm transition-colors ${store.finderShape === shape ? "bg-primary text-primary-fg" : "bg-stage border border-border text-fg hover:border-fg"}`,
								children: shape.charAt(0).toUpperCase() + shape.slice(1)
							}, shape))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted mb-2 block",
							children: "Frame"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col gap-2",
							children: ["none", "scan-me-bottom"].map((frame) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => store.setDesign({ frame }),
								className: `px-3 py-1.5 text-xs rounded-sm transition-colors ${store.frame === frame ? "bg-primary text-primary-fg" : "bg-stage border border-border text-fg hover:border-fg"}`,
								children: frame === "scan-me-bottom" ? "Scan Me Frame" : "No Frame"
							}, frame))
						})] })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border pt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium text-fg mb-4",
						children: "Center Logo"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								{
									name: "Twitter",
									url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXR3aXR0ZXIiPjxwYXRoIGQ9Ik0yMiA0cy0uNyAyLjEtMiAzLjRjMS42IDEwLTkuNCAxNy4zLTE4IDExLjYgMi4yLjEgNC40LS42IDYtMkMzIDE1LjUuNSA5LjYgMyA1YzIuMiAyLjYgNS42IDQuMSA5IDQtLjktNC4yIDQtNi42IDctMy44IDEuMSAwIDMtMS4yIDMtMS4yeiIvPjwvc3ZnPgo="
								},
								{
									name: "Facebook",
									url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWZhY2Vib29rIj48cGF0aCBkPSJNMTggMmgtM2E1IDUgMCAwIDAtNSA1djNIN3Y0aDN2OGg0di04aDNsMS00aC00VjdhMSAxIDAgMCAxIDEtMWgzeiIvPjwvc3ZnPgo="
								},
								{
									name: "GitHub",
									url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWdpdGh1YiI+PHBhdGggZD0iTTE1IDIydi00YTQuOCA0LjggMCAwIDAtMS0zLjVjMyAwIDYtMiA2LTUuNS4wOC0xLjI1LS4yNy0yLjQ4LTEtMy41LjI4LTEuMTUuMjgtMi4zNSAwLTMuNSAwIDAtMSAwLTMgMS41LTIuNjQtLjUtNS4zNi0uNS04IDBDNiAyIDUgMiA1IDJjLS4zIDEuMTUtLjMgMi4zNSAwIDMuNUE1LjQwMyA1LjQwMyAwIDAgMCA0IDljMCAzLjUgMyA1LjUgNiA1LjUtLjM5LjQ5LS42OCAxLjA1LS44NSAxLjY1LS4xNy42LS4yMiAxLjIzLS4xNSAxLjg1djQiLz48cGF0aCBkPSJNOSAxOGMtNC41MSAyLTUtMi03LTIiLz48L3N2Zz4K"
								},
								{
									name: "YouTube",
									url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXlvdXR1YmUiPjxwYXRoIGQ9Ik0yLjUgMTdhMjQuMTIgMjQuMTIgMCAwIDEgMC0xMCAyIDIgMCAwIDEgMS40LTEuNCA0OS41NiA0OS41NiAwIDAgMSAxNi4yIDBBMiAyIDAgMCAxIDIxLjUgN2EyNC4xMiAyNC4xMiAwIDAgMSAwIDEwIDIgMiAwIDAgMS0xLjQgMS40IDQ5LjU1IDQ5LjU1IDAgMCAxLTE2LjIgMEEyIDIgMCAwIDEgMi41IDE3Ii8+PHBhdGggZD0ibTEwIDE1IDUtMy01LTN6Ii8+PC9zdmc+Cg=="
								}
							].map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => store.setDesign({
									logoUrl: preset.url,
									ecl: "H"
								}),
								className: "flex h-9 items-center gap-2 rounded-sm border border-border bg-stage px-3 text-xs font-medium text-fg hover:border-fg transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: preset.url,
									alt: preset.name,
									className: "size-4"
								}), preset.name]
							}, preset.name))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "image/*",
									className: "hidden",
									ref: fileInputRef,
									onChange: handleLogoUpload
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => fileInputRef.current?.click(),
									className: "flex items-center gap-2 h-11 px-4 rounded-sm border border-border bg-stage text-sm text-fg hover:border-fg transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }), "Upload Logo"]
								}),
								store.logoUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: store.logoUrl,
										alt: "Logo preview",
										className: "size-11 object-contain bg-white border border-border rounded-sm"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => store.setDesign({ logoUrl: null }),
										className: "p-2 text-muted hover:text-red-500 transition-colors",
										title: "Remove logo",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
									})]
								})
							]
						})]
					}),
					store.logoUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted mt-2",
						children: "Error correction automatically set to High."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border pt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between gap-3 mb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "size",
						className: "text-sm font-medium text-fg",
						children: "Size"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("output", {
						className: "text-sm text-muted tabular-nums",
						children: [store.size, " px"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "size",
					type: "range",
					min: 160,
					max: 640,
					step: 16,
					value: store.size,
					onChange: (event) => store.setDesign({ size: snapSize(Number(event.target.value)) }),
					className: "h-11 w-full accent-primary"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border pt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
					className: "text-sm font-medium text-fg mb-3",
					children: "Error correction"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-4 gap-2",
					children: LEVELS.map((item) => {
						const selected = item.id === store.ecl;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: `flex min-h-16 cursor-pointer flex-col items-center justify-center rounded-sm border px-1 py-2 text-center transition-colors duration-150 ${selected ? "border-primary bg-primary text-primary-fg" : "border-border bg-stage text-fg hover:border-fg"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "radio",
									name: "error-correction",
									value: item.id,
									checked: selected,
									onChange: () => store.setDesign({ ecl: item.id }),
									className: "sr-only"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold",
									children: item.id
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-xs tabular-nums ${selected ? "text-primary-fg" : "text-muted"}`,
									children: item.recovery
								})
							]
						}, item.id);
					})
				})]
			})
		]
	});
}
var EXAMPLES = [{
	label: "Website",
	value: "https://example.com"
}, {
	label: "Note",
	value: "Meet me at the north gate at 6"
}];
function TemplatesSection() {
	const store = useQrStore();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-surface p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium text-fg mb-4",
				children: "Content Template"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2 mb-6",
				children: [
					"text",
					"wifi",
					"vcard",
					"email",
					"location",
					"batch"
				].map((type) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => store.setDataType(type),
					className: `px-3 py-1.5 rounded-sm text-sm font-medium transition-colors ${store.dataType === type ? "bg-primary text-primary-fg" : "border border-border bg-stage text-fg hover:border-fg"}`,
					children: type.charAt(0).toUpperCase() + type.slice(1)
				}, type))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end mb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: store.clearData,
							className: "text-xs text-muted hover:text-fg transition-colors",
							children: "Clear fields"
						})
					}),
					store.dataType === "text" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: store.text,
						rows: 4,
						spellCheck: false,
						placeholder: "https://example.com",
						onChange: (e) => store.setText(e.target.value),
						className: "w-full resize-y rounded-sm border border-border bg-stage px-3 py-3 text-base text-fg placeholder:text-muted"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted mb-2",
							children: "Examples"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-2",
							children: EXAMPLES.map((example) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => store.setText(example.value),
								className: "h-9 rounded-sm border border-border bg-stage px-3 text-xs font-medium text-fg transition-colors hover:border-fg",
								children: example.label
							}, example.label))
						})]
					})] }),
					store.dataType === "wifi" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium text-fg mb-1",
								children: "Network Name (SSID)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: store.wifi.ssid,
								onChange: (e) => store.updateWifi({ ssid: e.target.value }),
								className: "w-full h-11 rounded-sm border border-border bg-stage px-3 text-fg",
								placeholder: "My WiFi Network"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium text-fg mb-1",
								children: "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								value: store.wifi.pass,
								onChange: (e) => store.updateWifi({ pass: e.target.value }),
								className: "w-full h-11 rounded-sm border border-border bg-stage px-3 text-fg",
								placeholder: "Secret password"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									id: "hidden-wifi",
									checked: store.wifi.hidden,
									onChange: (e) => store.updateWifi({ hidden: e.target.checked }),
									className: "w-4 h-4"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "hidden-wifi",
									className: "text-sm text-fg",
									children: "Hidden Network"
								})]
							})
						]
					}),
					store.dataType === "vcard" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium text-fg mb-1",
								children: "First Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: store.vcard.firstName,
								onChange: (e) => store.updateVCard({ firstName: e.target.value }),
								className: "w-full h-11 rounded-sm border border-border bg-stage px-3 text-fg"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium text-fg mb-1",
								children: "Last Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: store.vcard.lastName,
								onChange: (e) => store.updateVCard({ lastName: e.target.value }),
								className: "w-full h-11 rounded-sm border border-border bg-stage px-3 text-fg"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium text-fg mb-1",
								children: "Phone"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "tel",
								value: store.vcard.phone,
								onChange: (e) => store.updateVCard({ phone: e.target.value }),
								className: "w-full h-11 rounded-sm border border-border bg-stage px-3 text-fg"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium text-fg mb-1",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								value: store.vcard.email,
								onChange: (e) => store.updateVCard({ email: e.target.value }),
								className: "w-full h-11 rounded-sm border border-border bg-stage px-3 text-fg"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium text-fg mb-1",
								children: "Company"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: store.vcard.org,
								onChange: (e) => store.updateVCard({ org: e.target.value }),
								className: "w-full h-11 rounded-sm border border-border bg-stage px-3 text-fg"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium text-fg mb-1",
								children: "Title"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: store.vcard.title,
								onChange: (e) => store.updateVCard({ title: e.target.value }),
								className: "w-full h-11 rounded-sm border border-border bg-stage px-3 text-fg"
							})] })
						]
					}),
					store.dataType === "email" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium text-fg mb-1",
								children: "To Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								value: store.emailData.to,
								onChange: (e) => store.updateEmail({ to: e.target.value }),
								className: "w-full h-11 rounded-sm border border-border bg-stage px-3 text-fg"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium text-fg mb-1",
								children: "Subject"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: store.emailData.subject,
								onChange: (e) => store.updateEmail({ subject: e.target.value }),
								className: "w-full h-11 rounded-sm border border-border bg-stage px-3 text-fg"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium text-fg mb-1",
								children: "Body"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: store.emailData.body,
								rows: 3,
								onChange: (e) => store.updateEmail({ body: e.target.value }),
								className: "w-full rounded-sm border border-border bg-stage px-3 py-2 text-fg"
							})] })
						]
					}),
					store.dataType === "location" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-sm font-medium text-fg mb-1",
							children: "Latitude"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							step: "any",
							value: store.locationData.lat,
							onChange: (e) => store.updateLocation({ lat: e.target.value }),
							className: "w-full h-11 rounded-sm border border-border bg-stage px-3 text-fg"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-sm font-medium text-fg mb-1",
							children: "Longitude"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							step: "any",
							value: store.locationData.lng,
							onChange: (e) => store.updateLocation({ lng: e.target.value }),
							className: "w-full h-11 rounded-sm border border-border bg-stage px-3 text-fg"
						})] })]
					}),
					store.dataType === "batch" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium text-fg mb-1",
								children: "Batch Items (One per line)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: store.batchData.join("\n"),
								rows: 6,
								spellCheck: false,
								placeholder: "https://example.com/1\nhttps://example.com/2\nhttps://example.com/3",
								onChange: (e) => store.setBatchData(e.target.value.split("\n")),
								className: "w-full resize-y rounded-sm border border-border bg-stage px-3 py-3 text-base text-fg placeholder:text-muted"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted mt-2",
								children: "Creates multiple QR codes at once. The first item is previewed on the right. Downloading will generate a ZIP file containing all QR codes."
							})
						] })
					})
				]
			})
		]
	});
}
function HistorySection() {
	const historyStore = useQrHistoryStore();
	const store = useQrStore();
	if (historyStore.history.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-surface p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-between items-center mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium text-fg",
				children: "History"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: historyStore.clearHistory,
				className: "text-xs text-muted hover:text-red-500 transition-colors",
				children: "Clear All"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar",
			children: historyStore.history.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between p-3 rounded-sm border border-border bg-stage",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0 mr-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-fg truncate",
						children: item.text || "Empty Payload"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted",
							children: [
								new Date(item.date).toLocaleDateString(),
								" ",
								new Date(item.date).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs px-1.5 py-0.5 rounded-full bg-surface border border-border text-muted uppercase",
							children: item.config.dataType
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							store.setDataType(item.config.dataType);
							if (item.config.dataType === "text") store.setText(item.text);
							store.updateWifi(item.config.wifi);
							store.updateVCard(item.config.vcard);
							store.updateEmail(item.config.emailData);
							store.updateLocation(item.config.locationData);
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
								logoUrl: item.config.logoUrl
							});
						},
						className: "p-1.5 text-muted hover:text-fg hover:bg-surface rounded-sm transition-colors",
						title: "Restore this configuration",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => historyStore.removeHistory(item.id),
						className: "p-1.5 text-muted hover:text-red-500 hover:bg-surface rounded-sm transition-colors",
						title: "Delete from history",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
					})]
				})]
			}, item.id))
		})]
	});
}
function friendlyError(err) {
	const message = err instanceof Error ? err.message : "";
	if (/too big|too large|cannot contain|capacity/i.test(message)) return "That text is too long for this error correction level. Shorten it, or switch to Low.";
	return "Could not make a code from that text.";
}
function FinderMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		"aria-hidden": true,
		className: "grid size-8 shrink-0 grid-cols-3 gap-0.5 rounded-sm bg-primary p-1",
		children: [
			1,
			1,
			1,
			1,
			0,
			1,
			1,
			1,
			1
		].map((on, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: on ? "bg-primary-fg" : "bg-transparent" }, index))
	});
}
function QrMaker() {
	const store = useQrStore();
	const historyStore = useQrHistoryStore();
	const debouncedPayload = useDebounce((0, import_react.useMemo)(() => {
		switch (store.dataType) {
			case "text": return store.text;
			case "wifi": return generateWifiString(store.wifi.ssid, store.wifi.pass, store.wifi.hidden);
			case "vcard": return generateVCardString(store.vcard);
			case "email": return generateEmailString(store.emailData.to, store.emailData.subject, store.emailData.body);
			case "location": return generateLocationString(parseFloat(store.locationData.lat) || 0, parseFloat(store.locationData.lng) || 0);
			case "batch":
				const validBatch = store.batchData.filter((line) => line.trim().length > 0);
				return validBatch.length > 0 ? validBatch[0] : "";
			default: return store.text;
		}
	}, [
		store.dataType,
		store.text,
		store.wifi,
		store.vcard,
		store.emailData,
		store.locationData,
		store.batchData
	]).trim(), 300);
	const [qrCode, setQrCode] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const wrapperRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!debouncedPayload) {
			setQrCode(null);
			setError(null);
			return;
		}
		let cancelled = false;
		(async () => {
			try {
				const created = (await import("../_libs/qrcode.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()))).default.create(debouncedPayload, { errorCorrectionLevel: store.ecl });
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
	debouncedPayload && `${debouncedPayload.slice(0, 140)}`;
	const getSvgString = () => {
		if (!wrapperRef.current) return null;
		const svg = wrapperRef.current.querySelector("svg");
		if (!svg) return null;
		return new XMLSerializer().serializeToString(svg);
	};
	const getCanvas = async () => {
		const svgString = getSvgString();
		if (!svgString) return null;
		return new Promise((resolve) => {
			const img = new Image();
			img.onload = () => {
				const canvas = document.createElement("canvas");
				canvas.width = store.size;
				canvas.height = store.size;
				const ctx = canvas.getContext("2d");
				if (ctx) ctx.drawImage(img, 0, 0);
				resolve(canvas);
			};
			img.onerror = (err) => {
				console.error("Failed to load SVG as image", err);
				resolve(null);
			};
			img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
		});
	};
	const createSvgStringForBatch = async (text) => {
		const created = (await import("../_libs/qrcode.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()))).default.create(text, { errorCorrectionLevel: store.ecl });
		const { renderToStaticMarkup } = await import("../_libs/@tanstack/react-router+[...].mjs").then((n) => /* @__PURE__ */ __toESM(n.n()));
		return renderToStaticMarkup(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomQrRenderer, {
			qr: created,
			fg1: store.fg1,
			fg2: store.fg2,
			bg: store.bg,
			size: store.size,
			gradientType: store.gradientType,
			moduleShape: store.moduleShape,
			finderShape: store.finderShape,
			frame: store.frame,
			logoUrl: store.logoUrl
		}));
	};
	const downloadBatch = async (ext) => {
		if (store.batchData.length === 0) return;
		const JSZip = (await import("../_libs/jszip+[...].mjs").then((n) => /* @__PURE__ */ __toESM(n.t()))).default;
		const zip = new JSZip();
		const validBatch = store.batchData.filter((line) => line.trim().length > 0);
		for (let i = 0; i < validBatch.length; i++) {
			const text = validBatch[i];
			if (!text) continue;
			const rawFilename = getDynamicFilename(text, ext);
			const parts = rawFilename.split(".");
			const filename = parts.length > 1 ? `${parts[0]}-${i + 1}.${parts[1]}` : `${rawFilename}-${i + 1}`;
			const svgString = await createSvgStringForBatch(text);
			if (ext === "svg") zip.file(filename, svgString);
			else {
				const dataUrl = await new Promise((resolve) => {
					const img = new Image();
					img.onload = () => {
						const canvas = document.createElement("canvas");
						canvas.width = store.size;
						canvas.height = store.size;
						const ctx = canvas.getContext("2d");
						if (ctx) ctx.drawImage(img, 0, 0);
						resolve(canvas.toDataURL("image/png"));
					};
					img.onerror = () => resolve("");
					img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
				});
				if (dataUrl) {
					const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
					zip.file(filename, base64Data, { base64: true });
				}
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
	};
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
	const downloadPdf = async () => {
		const canvas = await getCanvas();
		if (!canvas) return;
		const jsPDF = (await import("../_libs/jspdf.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()))).default;
		const url = canvas.toDataURL("image/png");
		const pdf = new jsPDF("p", "px", [store.size, store.size]);
		pdf.addImage(url, "PNG", 0, 0, store.size, store.size);
		pdf.save(getDynamicFilename(debouncedPayload, "pdf"));
		saveToHistory();
	};
	const downloadSvg = () => {
		if (store.dataType === "batch") {
			downloadBatch("svg");
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
		try {
			const getBlobPromise = async () => {
				const canvas = await getCanvas();
				if (!canvas) throw new Error("Could not create canvas");
				return new Promise((resolve, reject) => {
					canvas.toBlob((blob) => {
						if (blob) resolve(blob);
						else reject(/* @__PURE__ */ new Error("Could not create blob"));
					}, "image/png");
				});
			};
			await navigator.clipboard.write([new ClipboardItem({ "image/png": getBlobPromise() })]);
			alert("Copied to clipboard!");
		} catch (err) {
			console.error("Failed to copy image", err);
			alert("Failed to copy image to clipboard.");
		}
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
				frame: store.frame,
				logoUrl: store.logoUrl
			}
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinderMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl font-semibold tracking-tight text-fg",
						children: "Pressmark"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Live preview"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-semibold tracking-tight text-fg sm:text-5xl",
					children: "Make a QR code"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-base text-muted",
					children: "Choose a template, design it, and download. Colors, shapes, and logos update immediately."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid items-start gap-8 lg:mt-10 lg:grid-cols-5 lg:gap-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "order-2 flex flex-col gap-8 lg:order-1 lg:col-span-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TemplatesSection, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DesignSection, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HistorySection, {})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "order-1 lg:sticky lg:top-8 lg:order-2 lg:col-span-2 lg:self-start",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-surface p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium text-fg flex justify-between",
								children: "Preview"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto mt-4 w-full max-w-72",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "aspect-square w-full overflow-hidden rounded-sm border border-border bg-stage flex items-center justify-center",
									children: error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										role: "alert",
										className: "p-4 text-center text-sm text-fg",
										children: error
									}) : qrCode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										ref: wrapperRef,
										className: "w-full h-full flex items-center justify-center p-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomQrRenderer, {
											qr: qrCode,
											fg1: store.fg1,
											fg2: store.fg2,
											bg: store.bg,
											size: store.size,
											gradientType: store.gradientType,
											moduleShape: store.moduleShape,
											finderShape: store.finderShape,
											logoUrl: store.logoUrl
										})
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "p-4 text-center text-sm text-muted",
										children: "The code appears as you type."
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								"aria-live": "polite",
								className: "mt-4 text-center text-sm text-muted break-all",
								children: error ? "" : qrCode ? `Version ${qrCode.version} · saves at ${store.size}×${store.size}` : "Waiting for text"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex flex-col gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: downloadPng,
									disabled: !qrCode || Boolean(error),
									className: "inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-fg transition-opacity duration-150 disabled:cursor-not-allowed disabled:opacity-40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
										"aria-hidden": true,
										className: "size-4"
									}), store.dataType === "batch" ? "Download PNGs (ZIP)" : "Download PNG"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-3 gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: downloadSvg,
											disabled: !qrCode || Boolean(error),
											className: "inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-border bg-surface px-2 text-sm font-medium text-fg transition-colors duration-150 hover:border-fg disabled:cursor-not-allowed disabled:opacity-40",
											children: store.dataType === "batch" ? "SVGs (ZIP)" : "SVG"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: downloadPdf,
											disabled: !qrCode || Boolean(error) || store.dataType === "batch",
											className: "inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-border bg-surface px-2 text-sm font-medium text-fg transition-colors duration-150 hover:border-fg disabled:cursor-not-allowed disabled:opacity-40",
											children: "PDF"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: copyImage,
											disabled: !qrCode || Boolean(error) || store.dataType === "batch",
											className: "inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-border bg-surface px-2 text-sm font-medium text-fg transition-colors duration-150 hover:border-fg disabled:cursor-not-allowed disabled:opacity-40",
											children: "Copy"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-center text-sm text-muted",
								children: "The file includes a quiet margin so phones can scan it."
							})
						]
					})
				})]
			})]
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrMaker, {});
}
//#endregion
export { Home as component };
