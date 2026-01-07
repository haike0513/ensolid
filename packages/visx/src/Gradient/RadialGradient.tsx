import { JSX, mergeProps, splitProps, Show } from "solid-js";

export type RadialGradientProps = {
  /** Unique id for the gradient. Should be unique across all page elements. */
  id: string;
  /** Start color of gradient. */
  from?: string;
  /** End color of gradient. */
  to?: string;
  /** Number or percent defining the where the 'from' starting color is placed along the gradient. */
  fromOffset?: string | number;
  /** Opacity of the 'from' starting color. */
  fromOpacity?: string | number;
  /** Number or percent defining the where the 'to' ending color is placed along the gradient. */
  toOffset?: string | number;
  /** Opacity of the 'to' ending color. */
  toOpacity?: string | number;
  /** Rotation to apply to gradient. */
  rotate?: string | number;
  /** Transform to apply to radialGradient, overrides rotate. */
  transform?: string;
  /** Override of radialGradient children. */
  children?: JSX.Element;
} & JSX.SvgSVGAttributes<SVGRadialGradientElement>;

export function RadialGradient(props: RadialGradientProps) {
  const merged = mergeProps(
    {
      fromOffset: "0%",
      fromOpacity: 1,
      toOffset: "100%",
      toOpacity: 1,
    },
    props
  );

  const [local, rest] = splitProps(merged, [
    "children",
    "id",
    "from",
    "to",
    "fromOffset",
    "fromOpacity",
    "toOffset",
    "toOpacity",
    "rotate",
    "transform",
  ]);

  const gradientTransform = () => {
    if (local.rotate) {
      return `rotate(${local.rotate})`;
    }
    return local.transform;
  };

  return (
    <defs>
      <radialGradient
        id={local.id}
        gradientTransform={gradientTransform()}
        {...rest}
      >
        <Show when={!local.children} fallback={local.children}>
          <stop
            offset={local.fromOffset}
            stop-color={local.from}
            stop-opacity={local.fromOpacity}
          />
          <stop
            offset={local.toOffset}
            stop-color={local.to}
            stop-opacity={local.toOpacity}
          />
        </Show>
      </radialGradient>
    </defs>
  );
}
