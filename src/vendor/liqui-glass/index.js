import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import "./glass.css";

//#region src/filterRegistry.ts
/**
* Global registry of refraction filters.
*
* `backdrop-filter: url(#id)` resolves by id across the document, so filter
* defs don't have to live inside the surface that uses them. Keeping every
* filter (and its decoded feImage displacement map) in one persistent hidden
* <svg> means popups can unmount freely: the next surface with the same
* parameters references an already-decoded filter and refracts on its first
* frame — the same "pay once at page load" economics as a permanently
* mounted element, without keeping anything mounted.
*
* Only the very first surface ever rendered at a given (size, shape, optics)
* pays the one-off feImage decode, which the refract layer's fade-in masks.
*/
const SVG_NS = "http://www.w3.org/2000/svg";
const ISOLATE = {
	R: "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0",
	G: "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0",
	B: "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
};
let host = null;
const filterIds = /* @__PURE__ */ new Map();
let nextId = 0;
/**
* Bounded LRU, matching the image cache: a surface animating its box requests a
* filter per intermediate size, so an unbounded registry would grow a <filter>
* node per intermediate height and never release them.
*
* Eviction has to go by least-recently-used, not by age. A filter node still
* referenced by a surface on screen must not be the one that gets removed: the
* surface's `url(#id)` would resolve to nothing, Chromium would drop the whole
* backdrop-filter chain, and it would never recover — the reference is memoised
* on size and optics, neither of which changed, so nothing re-requests it. That
* is why the hit path below re-inserts.
*/
const FILTER_CACHE_MAX = 256;
function ensureHost() {
	if (host && host.isConnected) return host;
	host = document.createElementNS(SVG_NS, "svg");
	host.setAttribute("width", "0");
	host.setAttribute("height", "0");
	host.setAttribute("aria-hidden", "true");
	host.style.position = "absolute";
	host.style.pointerEvents = "none";
	document.body.appendChild(host);
	return host;
}
function el(name, attrs) {
	const node = document.createElementNS(SVG_NS, name);
	for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
	return node;
}
function displacement(scale, result) {
	const node = el("feDisplacementMap", {
		in: "SourceGraphic",
		in2: "map",
		scale,
		xChannelSelector: "R",
		yChannelSelector: "B"
	});
	if (result) node.setAttribute("result", result);
	return node;
}
/**
* Returns the id of a filter implementing the given optics, creating it in
* the persistent host on first request. `cold` is true only when the filter
* was just created (its feImage still has to decode) — callers use it to
* decide whether a masking fade-in is needed at all.
*/
function ensureFilter(params) {
	const { w, h, mapHref, refraction, dispersion } = params;
	const key = `${w}x${h}|r${refraction}|d${dispersion}|${mapHref.length}:${mapHref.slice(-24)}`;
	const existing = filterIds.get(key);
	if (existing) {
		filterIds.delete(key);
		filterIds.set(key, existing);
		return {
			id: existing,
			cold: false
		};
	}
	const id = `lq-refract-${nextId++}`;
	const filter = el("filter", {
		id,
		x: 0,
		y: 0,
		width: w,
		height: h,
		filterUnits: "userSpaceOnUse",
		"color-interpolation-filters": "sRGB"
	});
	const image = el("feImage", {
		x: 0,
		y: 0,
		width: w,
		height: h,
		result: "map"
	});
	image.setAttribute("href", mapHref);
	filter.appendChild(image);
	if (dispersion > 0) {
		filter.appendChild(displacement(refraction * (1 - dispersion), "dispR"));
		filter.appendChild(el("feColorMatrix", {
			in: "dispR",
			values: ISOLATE.R,
			result: "chR"
		}));
		filter.appendChild(displacement(refraction, "dispG"));
		filter.appendChild(el("feColorMatrix", {
			in: "dispG",
			values: ISOLATE.G,
			result: "chG"
		}));
		filter.appendChild(displacement(refraction * (1 + dispersion), "dispB"));
		filter.appendChild(el("feColorMatrix", {
			in: "dispB",
			values: ISOLATE.B,
			result: "chB"
		}));
		filter.appendChild(el("feComposite", {
			in: "chR",
			in2: "chG",
			operator: "arithmetic",
			k2: 1,
			k3: 1,
			result: "chRG"
		}));
		filter.appendChild(el("feComposite", {
			in: "chRG",
			in2: "chB",
			operator: "arithmetic",
			k2: 1,
			k3: 1
		}));
	} else filter.appendChild(displacement(refraction));
	ensureHost().appendChild(filter);
	filterIds.set(key, id);
	if (filterIds.size > FILTER_CACHE_MAX) {
		const [oldestKey, oldestId] = filterIds.entries().next().value;
		filterIds.delete(oldestKey);
		host?.querySelector(`#${oldestId}`)?.remove();
	}
	return {
		id,
		cold: true
	};
}
/**
* Warm the browser image cache for a data URL (e.g. the specular PNG) and
* pin the Image object so its decoded data isn't dropped while the surface
* sits in a display:none keepMounted subtree.
*/
const pinnedImages = /* @__PURE__ */ new Map();
function prewarmImage(href) {
	if (pinnedImages.has(href)) return;
	const img = new Image();
	img.src = href;
	pinnedImages.set(href, img);
	if (pinnedImages.size > FILTER_CACHE_MAX) pinnedImages.delete(pinnedImages.keys().next().value);
}

//#endregion
//#region src/tokens.ts
/**
* The liqui design tokens, and the only copy of them.
*
* They used to live in `tokens.css`, which meant they lived in three places —
* that stylesheet, the `cssVars` block the shadcn registry hands the CLI, and
* anything in JavaScript that needed to know a default in order to diff against
* it. Three hand-maintained copies of twelve colours is a drift bug with a
* schedule. `tokens.css` is now generated from this file at build time
* (tsdown.config.ts) and the registry's copy is checked against it
* (apps/www/scripts/build-registry.mts).
*
* No imports on purpose: the build config and the registry script both read
* this module directly, outside any bundler and without React.
*/
/**
* The themeable properties — the ones that describe the material globally.
* Deliberately not the whole `--lq-` namespace: `--lq-tail-rim`,
* `--lq-fade-start` and friends are plumbing set by the one component that
* needs them, and `--lq-radius` is written per surface from the `radius` prop,
* so putting either in a theme would ship a control that does nothing.
*/
const LIQUI_TOKENS = [
	"text",
	"text-dim",
	"tint",
	"tint-deep",
	"rim-hi",
	"rim-lo",
	"shadow",
	"highlight",
	"accent",
	"danger",
	"danger-text",
	"scrim"
];
const defaultTokens = {
	light: {
		text: "rgba(28, 28, 40, 0.95)",
		"text-dim": "rgba(28, 28, 40, 0.55)",
		tint: "rgba(255, 255, 255, 0.48)",
		"tint-deep": "rgba(255, 255, 255, 0.14)",
		"rim-hi": "rgba(255, 255, 255, 0.85)",
		"rim-lo": "rgba(255, 255, 255, 0.28)",
		shadow: "0 24px 60px rgba(10, 15, 40, 0.35), 0 4px 14px rgba(10, 15, 40, 0.18)",
		highlight: "rgba(255, 255, 255, 0.5)",
		accent: "#2f6bff",
		danger: "#e5484d",
		"danger-text": "#c1272c",
		scrim: "rgba(12, 14, 28, 0.32)"
	},
	dark: {
		text: "rgba(245, 246, 255, 0.96)",
		"text-dim": "rgba(245, 246, 255, 0.55)",
		tint: "rgba(30, 32, 46, 0.62)",
		"tint-deep": "rgba(18, 20, 32, 0.4)",
		"rim-hi": "rgba(255, 255, 255, 0.5)",
		"rim-lo": "rgba(255, 255, 255, 0.12)",
		shadow: "0 24px 60px rgba(0, 0, 5, 0.55), 0 4px 14px rgba(0, 0, 5, 0.35)",
		highlight: "rgba(255, 255, 255, 0.18)",
		accent: "#6f9dff",
		danger: "#ff7076",
		"danger-text": "#ff7076",
		scrim: "rgba(0, 0, 6, 0.48)"
	}
};
/**
* Dark mode is keyed on both `[data-theme="dark"]` (liqui's own demo and
* playground convention) and `.dark` (what shadcn's next-themes setup writes).
*/
const DARK_SELECTOR = "[data-theme='dark'], .dark";

//#endregion
//#region src/theme.tsx
const defaultGlassTheme = {
	material: "auto",
	profile: "squircle",
	frost: .35,
	specular: .7,
	dispersion: 0,
	saturation: 1.7,
	radiusScale: 1,
	refractionScale: 1,
	bezelScale: 1,
	blurScale: 1
};
const defaultTheme = {
	glass: defaultGlassTheme,
	light: defaultTokens.light,
	dark: defaultTokens.dark
};
/**
* Serialises the colour half of a theme to CSS, emitting only what differs from
* the shipped tokens — an untouched theme produces the empty string, so
* mounting a provider costs nothing and can't perturb anything.
*
* Both blocks are always emitted for the *union* of changed names, even when
* only one mode was edited. `:root` and `[data-theme='dark']` have the same
* specificity, so a `:root` override written after tokens.css would otherwise
* beat that stylesheet's dark block and leak a light value into dark mode.
* Re-asserting the dark value — customised or shipped — keeps the cascade
* pinned regardless of which mode the edit happened in.
*/
function themeCss(theme) {
	const changed = LIQUI_TOKENS.filter((name) => theme.light[name] !== defaultTokens.light[name] || theme.dark[name] !== defaultTokens.dark[name]);
	if (changed.length === 0) return "";
	const block = (selector, tokens) => `${selector} {\n` + changed.map((name) => `  --lq-${name}: ${tokens[name]};`).join("\n") + "\n}";
	return `${block(":root", theme.light)}\n\n${block(DARK_SELECTOR, theme.dark)}\n`;
}
const GlassThemeContext = React.createContext(defaultGlassTheme);
/** Read by `LiquiGlass` to fill in the props a surface didn't set. */
function useGlassTheme() {
	return React.useContext(GlassThemeContext);
}
/**
* Applies a theme to everything below it — and, for colour, to everything
* *anywhere*, since the token block is written at `:root`. That is deliberate:
* popups portal to `document.body`, outside any wrapper this provider could
* put around its children, and a scoped wrapper would leave every menu, dialog
* and tooltip on the old palette.
*
* The `<style>` is rendered inline rather than injected through an effect so
* the server emits it too: a themed app would otherwise paint one frame of the
* shipped palette before hydration.
*/
function LiquiThemeProvider({ theme, injectTokens = true, children }) {
	const glass = React.useMemo(() => theme?.glass ? {
		...defaultGlassTheme,
		...theme.glass
	} : defaultGlassTheme, [theme?.glass]);
	const css = React.useMemo(() => {
		if (!injectTokens) return "";
		return themeCss({
			light: {
				...defaultTokens.light,
				...theme?.light
			},
			dark: {
				...defaultTokens.dark,
				...theme?.dark
			}
		});
	}, [
		injectTokens,
		theme?.light,
		theme?.dark
	]);
	return /* @__PURE__ */ jsxs(GlassThemeContext.Provider, {
		value: glass,
		children: [css ? /* @__PURE__ */ jsx("style", {
			"data-liqui-theme": "",
			children: css
		}) : null, children]
	});
}

//#endregion
//#region src/LiquiGlass.tsx
/**
* Refraction (backdrop-filter: url(#svg-filter)) currently only renders in
* Chromium. Safari silently drops the whole backdrop-filter value when an SVG
* reference is present; Firefox ignores it too. WebKit has an implementation
* in review (bug 245510, PRs from July 2026) — when Safari ships it, raise the
* version gate below.
*/
const SAFARI_REFRACTION_MIN = Infinity;
const FIREFOX_REFRACTION_MIN = Infinity;
const supportsRefraction = (() => {
	if (typeof window === "undefined") return false;
	if (!CSS.supports("backdrop-filter", "blur(1px)")) return false;
	const ua = navigator.userAgent;
	const firefox = ua.match(/firefox\/(\d+)/i);
	if (firefox) return Number(firefox[1]) >= FIREFOX_REFRACTION_MIN;
	if (/^((?!chrome|chromium|edg|android).)*safari/i.test(ua)) {
		const version = ua.match(/version\/(\d+)/i);
		return Number(version?.[1] ?? 0) >= SAFARI_REFRACTION_MIN;
	}
	return true;
})();
/**
* Refraction magnitude along the bezel, indexed by normalized depth from the
* outer edge (0 = edge, 1 = inner end of the bezel). The physical profiles
* model a glass slab whose top surface follows a height function h(t): the
* surface slope gives the incident angle, Snell's law (n = 1.5) the bend, and
* the remaining glass depth the lateral shift — giving the sharp peak at the
* rim and smooth falloff of real thick glass. 'rim' is the cheap stylized
* falloff kept for comparison.
*/
const LUT_SIZE = 128;
const lutCache = /* @__PURE__ */ new Map();
function surfaceLUTs(profile) {
	const cached = lutCache.get(profile);
	if (cached) return cached;
	const mag = new Float32Array(LUT_SIZE);
	const slope = new Float32Array(LUT_SIZE);
	const n = 1.5;
	const T = .6;
	const h = profile === "squircle" ? (t) => Math.pow(1 - Math.pow(1 - t, 4), .25) : profile === "convex" ? (t) => Math.sqrt(1 - (1 - t) * (1 - t)) : (t) => 1 - (1 - t) * (1 - t);
	const eps = 1 / 1024;
	let max = 0;
	for (let i = 0; i < LUT_SIZE; i++) {
		const t = Math.max(i / (LUT_SIZE - 1), eps);
		const hi = Math.min(t + eps, 1);
		const lo = Math.max(t - eps, 0);
		slope[i] = (h(hi) - h(lo)) / (hi - lo) * T;
		if (profile === "rim") mag[i] = (1 - t) * (1 - t);
		else {
			const thetaI = Math.atan(Math.abs(slope[i]));
			const delta = thetaI - Math.asin(Math.sin(thetaI) / n);
			mag[i] = h(t) * T * Math.tan(delta);
			max = Math.max(max, mag[i]);
		}
	}
	if (max > 0) for (let i = 0; i < LUT_SIZE; i++) mag[i] /= max;
	const luts = {
		mag,
		slope
	};
	lutCache.set(profile, luts);
	return luts;
}
/**
* Rim-light angles: key light toward the top-left corner, dim counter-light
* toward the bottom-right. Specular intensity falls off with the *positional*
* azimuth around the shape center (a normal-based falloff would light whole
* straight edges uniformly — bevel-button, not glass), shaped by a Gaussian
* band across the bezel. Tuned for the bold arcs of the reference look.
*/
const THETA_KEY = Math.atan2(-.9, -.45);
const THETA_COUNTER = Math.atan2(.9, .5);
/**
* Displacement map for the lens effect, generated per-pixel on a canvas.
* R encodes horizontal displacement, B vertical; 128 is neutral. A
* rounded-rect signed distance field gives depth + outward normal per pixel;
* the LUT above gives the magnitude. Pixels sample toward the center
* (convex-lens edge magnification) — sampling outward would hit Chromium's
* backdrop edge-clamp and smear instead of refract.
*
* (Canvas instead of an SVG data-URI: feImage rasterizes SVG images with CSS
* features like mix-blend-mode disabled, which silently corrupts
* gradient-composited maps.)
*/
/**
* Maps are cached module-wide: popups remount at identical sizes on every
* open, so a reopen costs a Map lookup instead of a canvas render. Large
* surfaces render at half resolution — displacement vectors and the specular
* glow are smooth fields, so feImage/background stretching is invisible, and
* generation + PNG decode get ~4× cheaper (less pop-in latency).
*
* Bounded LRU: a surface that animates its box (an accordion panel expanding)
* walks through a distinct size every frame, so an unbounded cache would grow
* a PNG pair per intermediate height and never release them.
*/
const IMAGE_CACHE_MAX = 48;
const imageCache = /* @__PURE__ */ new Map();
function cacheGet(key) {
	const hit = imageCache.get(key);
	if (!hit) return void 0;
	imageCache.delete(key);
	imageCache.set(key, hit);
	return hit;
}
function cacheSet(key, value) {
	imageCache.set(key, value);
	if (imageCache.size > IMAGE_CACHE_MAX) imageCache.delete(imageCache.keys().next().value);
}
function glassImages(fullW, fullH, fullRadius, fullBezel, profile) {
	const key = `${fullW}x${fullH}r${fullRadius}b${fullBezel}${profile}`;
	const cached = cacheGet(key);
	if (cached) return cached;
	const scale = 1;
	const w = Math.ceil(fullW * scale);
	const h = Math.ceil(fullH * scale);
	const radius = fullRadius * scale;
	const bezel = fullBezel * scale;
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d");
	const image = ctx.createImageData(w, h);
	const data = image.data;
	const specCanvas = document.createElement("canvas");
	specCanvas.width = w;
	specCanvas.height = h;
	const specCtx = specCanvas.getContext("2d");
	const specImage = specCtx.createImageData(w, h);
	const spec = specImage.data;
	const { mag: lut } = surfaceLUTs(profile);
	const r = Math.min(radius, w / 2, h / 2);
	const bx = w / 2 - r;
	const by = h / 2 - r;
	for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
		const px = x + .5 - w / 2;
		const py = y + .5 - h / 2;
		const qx = Math.abs(px) - bx;
		const qy = Math.abs(py) - by;
		const ox = Math.max(qx, 0);
		const oy = Math.max(qy, 0);
		const depth = -(Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - r);
		let nx = 0;
		let ny = 0;
		if (qx > 0 && qy > 0) {
			const len = Math.hypot(qx, qy) || 1;
			nx = Math.sign(px) * qx / len;
			ny = Math.sign(py) * qy / len;
		} else if (qx > qy) nx = Math.sign(px);
		else ny = Math.sign(py);
		const d = depth / bezel;
		const inRim = d < 1 && d >= 0;
		const idx = inRim ? Math.min(Math.round(d * (LUT_SIZE - 1)), LUT_SIZE - 1) : 0;
		const mag = inRim ? lut[idx] : 0;
		const i = (y * w + x) * 4;
		data[i] = Math.round(128 - nx * mag * 127);
		data[i + 1] = 128;
		data[i + 2] = Math.round(128 - ny * mag * 127);
		data[i + 3] = 255;
		if (inRim) {
			const theta = Math.atan2(py / (h / 2), px / (w / 2));
			const band = Math.exp(-(((d - .2) / .4) ** 2));
			const c1 = Math.max(Math.cos(theta - THETA_KEY), 0);
			const c2 = Math.max(Math.cos(theta - THETA_COUNTER), 0);
			const intensity = Math.min(band * (1.15 * c1 ** 3 + .75 * c2 ** 3.5), 1);
			spec[i] = 255;
			spec[i + 1] = 255;
			spec[i + 2] = 255;
			spec[i + 3] = Math.round(intensity * 255);
		}
	}
	ctx.putImageData(image, 0, 0);
	specCtx.putImageData(specImage, 0, 0);
	const result = {
		map: canvas.toDataURL(),
		specular: specCanvas.toDataURL()
	};
	cacheSet(key, result);
	return result;
}
/**
* LiquiGlass — the base surface primitive of the liqui component library.
* Layers: refracting backdrop → tint → specular rim → content.
*/
const LiquiGlass = React.forwardRef(function LiquiGlass$1(props, forwardedRef) {
	const theme = useGlassTheme();
	const { material = theme.material, profile = theme.profile, radius: ownRadius = 16, blur: ownBlur = 1, refraction: ownRefraction = 140, bezel: ownBezel = 26, dispersion = theme.dispersion, specular = theme.specular, frost = theme.frost, saturation = theme.saturation, elevated = false, className, contentClassName, style, children,...rest } = props;
	const radius = Math.round(ownRadius * theme.radiusScale);
	const blur = Math.round(ownBlur * theme.blurScale * 100) / 100;
	const refraction = Math.round(ownRefraction * theme.refractionScale);
	const bezel = Math.max(1, Math.round(ownBezel * theme.bezelScale));
	const [refractionAllowed, setRefractionAllowed] = React.useState(false);
	React.useLayoutEffect(() => {
		if (supportsRefraction) setRefractionAllowed(true);
	}, []);
	const tier = material === "clear" ? "clear" : material === "frost" ? "frost" : refractionAllowed ? "refract" : "frost";
	const localRef = React.useRef(null);
	const [size, setSize] = React.useState(null);
	React.useImperativeHandle(forwardedRef, () => localRef.current, []);
	React.useLayoutEffect(() => {
		if (tier !== "refract" || !localRef.current) return;
		const el$1 = localRef.current;
		const apply = (w, h) => {
			if (w > 0 && h > 0) setSize((prev) => prev && prev.w === w && prev.h === h ? prev : {
				w,
				h
			});
		};
		apply(el$1.offsetWidth, el$1.offsetHeight);
		const observer = new ResizeObserver((entries) => {
			const rect = entries[0].contentRect;
			apply(Math.round(rect.width), Math.round(rect.height));
		});
		observer.observe(el$1);
		return () => observer.disconnect();
	}, [tier]);
	const refractionReady = tier === "refract" && size !== null;
	const glassRefs = React.useMemo(() => {
		if (!refractionReady) return null;
		const images = glassImages(size.w, size.h, radius, bezel, profile);
		prewarmImage(images.specular);
		const { id: filterId, cold } = ensureFilter({
			w: size.w,
			h: size.h,
			mapHref: images.map,
			refraction,
			dispersion
		});
		return {
			images,
			filterId,
			cold
		};
	}, [
		refractionReady,
		size,
		radius,
		bezel,
		profile,
		refraction,
		dispersion
	]);
	const [fadeDone, setFadeDone] = React.useState(false);
	const needsFade = (glassRefs?.cold ?? false) && !fadeDone;
	React.useEffect(() => {
		if (!glassRefs?.cold || fadeDone) return;
		const timer = setTimeout(() => setFadeDone(true), 250);
		return () => clearTimeout(timer);
	}, [glassRefs?.cold, fadeDone]);
	const effectiveBlur = blur + frost * 14;
	const backdropFilter = tier === "clear" ? void 0 : tier === "frost" ? `blur(${Math.max(effectiveBlur * 2, 10)}px) saturate(${saturation})` : `blur(${effectiveBlur}px) saturate(${saturation})`;
	const refractFilter = glassRefs ? `url(#${glassRefs.filterId})` : void 0;
	const tintOpacity = tier === "clear" ? 1 : .25 + .75 * frost;
	return /* @__PURE__ */ jsxs("div", {
		...rest,
		ref: localRef,
		className: [
			"liqui-glass",
			`liqui-glass--${tier}`,
			elevated ? "liqui-glass--elevated" : "",
			className ?? ""
		].join(" ").trim(),
		style: {
			...style,
			["--lq-radius"]: `${radius}px`
		},
		children: [
			backdropFilter && /* @__PURE__ */ jsx("span", {
				className: "liqui-glass__backdrop",
				style: {
					backdropFilter,
					WebkitBackdropFilter: backdropFilter
				}
			}),
			refractFilter && /* @__PURE__ */ jsx("span", {
				className: needsFade ? "liqui-glass__refract liqui-glass__refract--fade" : "liqui-glass__refract",
				style: {
					backdropFilter: refractFilter,
					WebkitBackdropFilter: refractFilter
				}
			}),
			/* @__PURE__ */ jsx("span", {
				className: "liqui-glass__tint",
				style: { opacity: tintOpacity }
			}),
			glassRefs && specular > 0 && /* @__PURE__ */ jsx("span", {
				className: needsFade ? "liqui-glass__specular liqui-glass__specular--fade" : "liqui-glass__specular",
				style: {
					backgroundImage: `url(${glassRefs.images.specular})`,
					opacity: specular
				}
			}),
			/* @__PURE__ */ jsx("span", { className: "liqui-glass__shine" }),
			/* @__PURE__ */ jsx("div", {
				className: ["liqui-glass__content", contentClassName ?? ""].join(" ").trim(),
				children
			})
		]
	});
});

//#endregion
export { DARK_SELECTOR, LIQUI_TOKENS, LiquiGlass, LiquiThemeProvider, defaultGlassTheme, defaultTheme, defaultTokens, ensureFilter, prewarmImage, themeCss, useGlassTheme };