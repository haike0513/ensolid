import { JSX, mergeProps, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

export type TooltipProps = {
  /** Tooltip content. */
  children?: JSX.Element;
  /** Optional className to apply to the Tooltip in addition to `visx-tooltip`. */
  class?: string;
  /** The `left` position of the Tooltip. */
  left?: number;
  /** Offset the `left` position of the Tooltip by this margin. */
  offsetLeft?: number;
  /** Offset the `top` position of the Tooltip by this margin. */
  offsetTop?: number;
  /** Styles to apply, unless `unstyled=true`. */
  style?: JSX.CSSProperties | string;
  /** The `top` position of the Tooltip. */
  top?: number;
  /**
   * Applies position: 'absolute' for tooltips to correctly position themselves
   * when `unstyled=true`. In a future major release this will be the default behavior.
   */
  applyPositionStyle?: boolean;
  /**
   * Whether to omit applying any style, except `left` / `top`.
   * In most cases if this is `true` a developer must do one of the following
   * for positioning to work correctly:
   * - set `applyPositionStyle=true`
   * - create a CSS selector like: `.visx-tooltip { position: 'absolute' }`
   */
  unstyled?: boolean;
  /** Element type to render, defaults to 'div' */
  as?: string;
} & JSX.HTMLAttributes<HTMLDivElement>;

export const defaultStyles: JSX.CSSProperties = {
  position: "absolute",
  "background-color": "white",
  color: "#666666",
  padding: "0.3rem 0.5rem",
  "border-radius": "3px",
  "font-size": "14px",
  "box-shadow": "0 1px 2px rgba(33,33,33,0.2)",
  "line-height": "1em",
  "pointer-events": "none",
};

export function Tooltip(props: TooltipProps) {
  const merged = mergeProps(
    {
      offsetLeft: 10,
      offsetTop: 10,
      style: defaultStyles,
      unstyled: false,
      applyPositionStyle: false,
      as: "div",
    },
    props
  );

  const [local, rest] = splitProps(merged, [
    "class",
    "top",
    "left",
    "offsetLeft",
    "offsetTop",
    "style",
    "children",
    "unstyled",
    "applyPositionStyle",
    "as",
  ]);

  const computedStyle = (): JSX.CSSProperties => {
    const styles: JSX.CSSProperties = {};

    if (local.top != null && local.offsetTop != null) {
      styles.top = `${local.top + local.offsetTop}px`;
    } else if (local.top != null) {
      styles.top = `${local.top}px`;
    }

    if (local.left != null && local.offsetLeft != null) {
      styles.left = `${local.left + local.offsetLeft}px`;
    } else if (local.left != null) {
      styles.left = `${local.left}px`;
    }

    if (local.applyPositionStyle) {
      styles.position = "absolute";
    }

    if (!local.unstyled && typeof local.style === "object") {
      return { ...(local.style as JSX.CSSProperties), ...styles };
    }

    return styles;
  };

  return (
    <Dynamic
      component={local.as}
      class={`visx-tooltip ${local.class || ""}`}
      style={computedStyle()}
      {...rest}
    >
      {local.children}
    </Dynamic>
  );
}
