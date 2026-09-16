import * as React from "react";

//#region src/LiquiGlass.d.ts
type GlassMaterial = 'auto' | 'frost' | 'clear';
type GlassProfile = 'squircle' | 'convex' | 'rim';
interface LiquiGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Rendering tier — the perf/quality trade-off, exposed so apps (or their
   * users) can downgrade:
   * - 'auto'  — true refraction where supported, frosted glass elsewhere
   * - 'frost' — always frosted (blur + saturate); no SVG filter, no canvas map
   * - 'clear' — tint and rim only, no backdrop-filter at all (cheapest)
   */
  material?: GlassMaterial;
  /** Lens shape of the refracting rim. 'squircle' is the most glass-like. */
  profile?: GlassProfile;
  /**
   * Corner radius of the glass surface in px.
   *
   * This and the three below are the *geometric* dials: they scale with the
   * surface, so a theme multiplies them (`radiusScale` and friends) rather than
   * replacing them. See `LiquiThemeProvider`.
   */
  radius?: number;
  /** Backdrop blur in px (refraction tier; frost uses 4×). */
  blur?: number;
  /** Strength of the edge refraction in px (feDisplacementMap scale). */
  refraction?: number;
  /** Width in px of the refracting rim at the edge of the surface. */
  bezel?: number;
  /**
   * Chromatic aberration: 0 disables (single displacement pass), >0 splits
   * R/G/B into three displacement passes at ±dispersion relative scale.
   * Costs roughly 3× filter work — keep 0 where perf matters.
   */
  dispersion?: number;
  /**
   * Opacity of the normal-lit specular layer (0 disables). Only rendered in
   * the refraction tier; frost/clear keep the cheap inset-shadow shine.
   */
  specular?: number;
  /**
   * Material density, 0–1, mirroring Apple's Liquid Glass variants:
   * 0 ≈ "clear" (transparent, for media-rich backdrops with their own
   * dimming), 1 ≈ "regular" (adaptive frosted tint that carries legibility).
   * Interpolates tint opacity and adds up to 14px of blur on top of `blur`.
   */
  frost?: number;
  /** Extra saturation pushed through the glass. */
  saturation?: number;
  /** Depth level: raises tint opacity + shadow. */
  elevated?: boolean;
  /**
   * Classes for the content wrapper that sits above every glass layer.
   *
   * Padding, flex layout and typography belong to the *component* built on the
   * glass, not to the glass — but that wrapper is rendered here, so a consumer
   * styling it from outside would need a descendant selector
   * (`[&>.liqui-glass__content]:…`), which utility classes express badly. This
   * prop hands the wrapper over directly so a registry component can stay pure
   * Tailwind.
   */
  contentClassName?: string;
}
/**
 * LiquiGlass — the base surface primitive of the liqui component library.
 * Layers: refracting backdrop → tint → specular rim → content.
 */
declare const LiquiGlass: React.ForwardRefExoticComponent<LiquiGlassProps & React.RefAttributes<HTMLDivElement>>;
//#endregion
//#region src/filterRegistry.d.ts
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
interface FilterParams {
  w: number;
  h: number;
  mapHref: string;
  refraction: number;
  dispersion: number;
}
/**
 * Returns the id of a filter implementing the given optics, creating it in
 * the persistent host on first request. `cold` is true only when the filter
 * was just created (its feImage still has to decode) — callers use it to
 * decide whether a masking fade-in is needed at all.
 */
declare function ensureFilter(params: FilterParams): {
  id: string;
  cold: boolean;
};
declare function prewarmImage(href: string): void;
//#endregion
//#region src/tokens.d.ts
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
declare const LIQUI_TOKENS: readonly ["text", "text-dim", "tint", "tint-deep", "rim-hi", "rim-lo", "shadow", "highlight", "accent", "danger", "danger-text", "scrim"];
type LiquiTokenName = (typeof LIQUI_TOKENS)[number];
type LiquiTokens = Record<LiquiTokenName, string>;
declare const defaultTokens: {
  light: LiquiTokens;
  dark: LiquiTokens;
};
/**
 * Dark mode is keyed on both `[data-theme="dark"]` (liqui's own demo and
 * playground convention) and `.dark` (what shadcn's next-themes setup writes).
 */
declare const DARK_SELECTOR = "[data-theme='dark'], .dark";
//#endregion
//#region src/theme.d.ts
/**
 * Global theming for liqui.
 *
 * A liqui surface is themed along two axes that behave nothing alike, and the
 * split below is the whole design:
 *
 * **Colour is CSS.** Every colour a surface paints comes from a `--lq-*`
 * custom property, so a theme can change all of it by writing twelve variables
 * — no React involved, and it keeps working inside portals, `::backdrop`, and
 * markup this library never sees.
 *
 * **Optics are JavaScript.** `refraction`, `bezel`, `radius` and `profile` feed
 * a canvas-generated displacement map and an SVG filter, so they can only be
 * props. And they are *per-component* props: a Button asks for
 * `refraction: 45, bezel: 11` while a Drawer asks for `150, 34`, because the
 * numbers scale with the surface. A global "set refraction to 150" would turn
 * every scrollbar thumb into a smear.
 *
 * So the two kinds of optical dial are themed differently:
 *
 * - **Absolute** (`material`, `profile`, `frost`, `specular`, `dispersion`,
 *   `saturation`) — the ones components mostly leave alone. The theme supplies
 *   the default; an explicit prop still wins.
 * - **Geometric** (`radius`, `refraction`, `bezel`, `blur`) — the ones every
 *   component sets for itself. The theme supplies a *multiplier*, so the
 *   proportions between a thumb and a drawer survive the edit.
 *
 * An untouched theme is a no-op by construction: every scale is 1, every
 * absolute matches `LiquiGlass`'s own default, and `themeCss` emits nothing
 * when no token differs. Mounting the provider changes no pixel.
 */
interface LiquiGlassTheme {
  /** Rendering tier default. Surfaces that pass `material` still win. */
  material: GlassMaterial;
  /** Lens profile default. */
  profile: GlassProfile;
  /** Material density default, 0–1. */
  frost: number;
  /** Specular rim opacity default, 0–1. */
  specular: number;
  /** Chromatic aberration default. >0 costs ~3× filter work. */
  dispersion: number;
  /** Backdrop saturation default. */
  saturation: number;
  /** Multiplies each surface's own corner radius. */
  radiusScale: number;
  /** Multiplies each surface's own displacement scale. */
  refractionScale: number;
  /** Multiplies each surface's own bezel width. */
  bezelScale: number;
  /** Multiplies each surface's own base blur. */
  blurScale: number;
}
declare const defaultGlassTheme: LiquiGlassTheme;
interface LiquiTheme {
  glass: LiquiGlassTheme;
  light: LiquiTokens;
  dark: LiquiTokens;
}
declare const defaultTheme: LiquiTheme;
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
declare function themeCss(theme: Pick<LiquiTheme, 'light' | 'dark'>): string;
/** Read by `LiquiGlass` to fill in the props a surface didn't set. */
declare function useGlassTheme(): LiquiGlassTheme;
interface LiquiThemeProviderProps {
  theme?: Partial<LiquiTheme>;
  /**
   * Set false to keep the provider to optics only — for an app whose `--lq-*`
   * values live in its own stylesheet and shouldn't be overridden at runtime.
   */
  injectTokens?: boolean;
  children?: React.ReactNode;
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
declare function LiquiThemeProvider({
  theme,
  injectTokens,
  children
}: LiquiThemeProviderProps): React.JSX.Element;
//#endregion
export { DARK_SELECTOR, type GlassMaterial, type GlassProfile, LIQUI_TOKENS, LiquiGlass, type LiquiGlassProps, type LiquiGlassTheme, type LiquiTheme, LiquiThemeProvider, type LiquiThemeProviderProps, type LiquiTokenName, type LiquiTokens, defaultGlassTheme, defaultTheme, defaultTokens, ensureFilter, prewarmImage, themeCss, useGlassTheme };