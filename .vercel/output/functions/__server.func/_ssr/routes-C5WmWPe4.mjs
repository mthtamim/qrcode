import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Download } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C5WmWPe4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STORAGE_KEY = "pressmark.v1";
var SIZE_MIN = 160;
var SIZE_MAX = 640;
var SIZE_STEP = 16;
var DEFAULT_SIZE = 320;
var LEVELS = [
	{
		id: "L",
		name: "Low",
		recovery: "7%",
		hint: "Low recovers about 7% of a damaged code and fits the most text."
	},
	{
		id: "M",
		name: "Medium",
		recovery: "15%",
		hint: "Medium recovers about 15%. A solid default for links and short notes."
	},
	{
		id: "Q",
		name: "Quartile",
		recovery: "25%",
		hint: "Quartile recovers about 25%. Useful if the code might get scratched or covered."
	},
	{
		id: "H",
		name: "High",
		recovery: "30%",
		hint: "High recovers about 30%, but it holds the least text."
	}
];
var EXAMPLES = [{
	label: "Website",
	value: "https://example.com"
}, {
	label: "Note",
	value: "Meet me at the north gate at 6"
}];
function parseHex(input) {
	const raw = input.trim().replace(/^#/, "");
	if (/^[0-9a-fA-F]{3}$/.test(raw)) return `#${raw.split("").map((channel) => channel + channel).join("").toLowerCase()}`;
	if (/^[0-9a-fA-F]{6}$/.test(raw)) return `#${raw.toLowerCase()}`;
	return null;
}
function snapSize(value) {
	if (!Number.isFinite(value)) return DEFAULT_SIZE;
	return SIZE_MIN + Math.round((Math.min(SIZE_MAX, Math.max(SIZE_MIN, value)) - SIZE_MIN) / SIZE_STEP) * SIZE_STEP;
}
function hexToRgb(hex) {
	const parsed = parseHex(hex);
	if (!parsed) return null;
	const n = Number.parseInt(parsed.slice(1), 16);
	return [
		n >> 16 & 255,
		n >> 8 & 255,
		n & 255
	];
}
function channelLuminance(channel) {
	const s = channel / 255;
	return s <= .04045 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4;
}
function contrastRatio(foreground, background) {
	const fg = hexToRgb(foreground);
	const bg = hexToRgb(background);
	if (!fg || !bg) return null;
	const l1 = .2126 * channelLuminance(fg[0]) + .7152 * channelLuminance(fg[1]) + .0722 * channelLuminance(fg[2]);
	const l2 = .2126 * channelLuminance(bg[0]) + .7152 * channelLuminance(bg[1]) + .0722 * channelLuminance(bg[2]);
	const lighter = Math.max(l1, l2);
	const darker = Math.min(l1, l2);
	return (lighter + .05) / (darker + .05);
}
function friendlyError(err) {
	const message = err instanceof Error ? err.message : "";
	if (/too big|too large|cannot contain|capacity/i.test(message)) return "That text is too long for this error correction level. Shorten it, or switch to Low.";
	return "Could not make a code from that text.";
}
function readSettings() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const data = JSON.parse(raw);
		if (typeof data.text !== "string" || typeof data.size !== "number") return null;
		const fg = typeof data.fg === "string" ? parseHex(data.fg) : null;
		const bg = typeof data.bg === "string" ? parseHex(data.bg) : null;
		if (!fg || !bg) return null;
		if (data.ecl !== "L" && data.ecl !== "M" && data.ecl !== "Q" && data.ecl !== "H") return null;
		return {
			text: data.text,
			fg,
			bg,
			size: snapSize(data.size),
			ecl: data.ecl
		};
	} catch {
		return null;
	}
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
function ColorField({ id, label, value, onChange }) {
	const [draft, setDraft] = (0, import_react.useState)(value);
	(0, import_react.useEffect)(() => {
		setDraft(value);
	}, [value]);
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
			onChange: (event) => onChange(event.target.value.toLowerCase()),
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
function QrMaker() {
	const [text, setText] = (0, import_react.useState)("");
	const [fg, setFg] = (0, import_react.useState)("#141210");
	const [bg, setBg] = (0, import_react.useState)("#ffffff");
	const [size, setSize] = (0, import_react.useState)(DEFAULT_SIZE);
	const [ecl, setEcl] = (0, import_react.useState)("M");
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const [svgUrl, setSvgUrl] = (0, import_react.useState)(null);
	const [version, setVersion] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [downloading, setDownloading] = (0, import_react.useState)(false);
	const requestId = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
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
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		const settings = {
			text,
			fg,
			bg,
			size,
			ecl
		};
		localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
	}, [
		hydrated,
		text,
		fg,
		bg,
		size,
		ecl
	]);
	(0, import_react.useEffect)(() => {
		const value = text.trim();
		if (!value) {
			setSvgUrl(null);
			setVersion(null);
			setError(null);
			return;
		}
		const id = ++requestId.current;
		let cancelled = false;
		(async () => {
			try {
				const mod = await import("../_libs/qrcode.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
				const created = mod.default.create(value, { errorCorrectionLevel: ecl });
				const svg = await mod.default.toString(value, {
					type: "svg",
					errorCorrectionLevel: ecl,
					margin: 4,
					color: {
						dark: fg,
						light: bg
					}
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
	}, [
		text,
		fg,
		bg,
		ecl
	]);
	const ratio = contrastRatio(fg, bg);
	const lowContrast = ratio !== null && ratio < 3;
	const level = LEVELS.find((item) => item.id === ecl) ?? LEVELS[1];
	const previewLabel = text.trim() ? `QR code for ${text.trim().slice(0, 140)}` : "QR code preview";
	async function download() {
		const value = text.trim();
		if (!value || error || downloading) return;
		setDownloading(true);
		try {
			const url = await (await import("../_libs/qrcode.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()))).default.toDataURL(value, {
				errorCorrectionLevel: ecl,
				margin: 4,
				width: size,
				color: {
					dark: fg,
					light: bg
				}
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
					children: "Type a URL or any text. Colors, size, and error correction update the preview immediately."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid items-start gap-8 lg:mt-10 lg:grid-cols-5 lg:gap-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "order-2 flex flex-col gap-8 lg:order-1 lg:col-span-3",
					onSubmit: (event) => event.preventDefault(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "payload",
								className: "text-sm font-medium text-fg",
								children: "URL or text"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								id: "payload",
								name: "payload",
								value: text,
								rows: 4,
								spellCheck: false,
								autoCorrect: "off",
								autoCapitalize: "none",
								placeholder: "https://example.com",
								"aria-describedby": "payload-hint",
								onChange: (event) => setText(event.target.value),
								className: "mt-2 min-h-28 w-full resize-y rounded-sm border border-border bg-stage px-3 py-3 text-base text-fg placeholder:text-muted"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									id: "payload-hint",
									className: "text-sm text-muted",
									children: "Updates as you type."
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted tabular-nums",
									children: [text.length, " characters"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									id: "examples-label",
									className: "text-sm text-muted",
									children: "Examples"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									role: "group",
									"aria-labelledby": "examples-label",
									className: "mt-2 flex flex-wrap gap-2",
									children: EXAMPLES.map((example) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											setText(example.value);
											document.getElementById("payload")?.focus();
										},
										className: "h-11 rounded-sm border border-border bg-stage px-3 text-sm font-medium text-fg transition-colors duration-150 hover:border-fg",
										children: example.label
									}, example.label))
								})]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
								className: "text-sm font-medium text-fg",
								children: "Colors"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 grid gap-4 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
									id: "foreground",
									label: "Foreground",
									value: fg,
									onChange: setFg
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
									id: "background",
									label: "Background",
									value: bg,
									onChange: setBg
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setFg(bg);
									setBg(fg);
								},
								className: "mt-3 h-11 rounded-sm border border-border bg-stage px-3 text-sm font-medium text-fg transition-colors duration-150 hover:border-fg",
								children: "Swap colors"
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "size",
									className: "text-sm font-medium text-fg",
									children: "Size"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("output", {
									htmlFor: "size",
									className: "text-sm text-muted tabular-nums",
									children: [size, " px"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "size",
								name: "size",
								type: "range",
								min: SIZE_MIN,
								max: SIZE_MAX,
								step: SIZE_STEP,
								value: size,
								"aria-describedby": "size-hint",
								onChange: (event) => setSize(snapSize(Number(event.target.value))),
								className: "mt-2 h-11 w-full accent-primary"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								id: "size-hint",
								className: "text-sm text-muted",
								children: "Pixel width and height of the downloaded PNG."
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
							"aria-describedby": "ecl-hint",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
									className: "text-sm font-medium text-fg",
									children: "Error correction"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 grid grid-cols-4 gap-2",
									children: LEVELS.map((item) => {
										const selected = item.id === ecl;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: `flex min-h-16 cursor-pointer flex-col items-center justify-center rounded-sm border px-1 py-2 text-center transition-colors duration-150 ${selected ? "border-primary bg-primary text-primary-fg" : "border-border bg-stage text-fg hover:border-fg"}`,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "radio",
													name: "error-correction",
													value: item.id,
													checked: selected,
													"aria-label": `${item.name} error correction, about ${item.recovery} recovery`,
													onChange: () => setEcl(item.id),
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
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									id: "ecl-hint",
									className: "mt-3 text-sm text-muted",
									children: level.hint
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "order-1 lg:sticky lg:top-8 lg:order-2 lg:col-span-2 lg:self-start",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-surface p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium text-fg",
								children: "Preview"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto mt-4 w-full max-w-72",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "aspect-square w-full overflow-hidden rounded-sm border border-border bg-stage",
									children: error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										role: "alert",
										className: "flex h-full items-center justify-center p-4 text-center text-sm text-fg",
										children: error
									}) : svgUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: svgUrl,
										alt: previewLabel,
										className: "h-full w-full"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "flex h-full items-center justify-center p-4 text-center text-sm text-muted",
										children: "The code appears as you type."
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								"aria-live": "polite",
								className: "mt-4 text-center text-sm text-muted",
								children: error ? "" : svgUrl && version ? `Version ${version} · saves at ${size}×${size}` : "Waiting for text"
							}),
							lowContrast && svgUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								role: "status",
								className: "mt-2 text-center text-sm text-fg",
								children: "These colors are very close. A scanner may not read the code."
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => void download(),
								disabled: !svgUrl || Boolean(error) || downloading,
								className: "mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-fg transition-opacity duration-150 disabled:cursor-not-allowed disabled:opacity-40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
									"aria-hidden": true,
									className: "size-4"
								}), downloading ? "Preparing PNG…" : "Download PNG"]
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
