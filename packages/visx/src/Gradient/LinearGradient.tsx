import { JSX, mergeProps, splitProps, Show } from "solid-js";

type LinearGradientOwnProps = {
  /** Unique id for the gradient. Should be unique across all page elements. */
  id: string;
  /** Start color of gradient. */
  from?: string;
  /** End color of gradient. */
  to?: string;
  /** The x coordinate of the starting point along which the linear gradient is drawn. */
  x1?: string | number;
  /** The x coordinate of the ending point along which the linear gradient is drawn. */
  x2?: string | number;
  /** The y coordinate of the starting point along which the linear gradient is drawn. */
  y1?: string | number;
  /** The y coordinate of the ending point along which the linear gradient is drawn. */
  y2?: string | number;
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
  /** Transform to apply to linearGradient, overrides rotate. */
  transform?: string;
  /** Override of linearGradient children. */
  children?: JSX.Element;
  /** (When no x or y values are passed), will orient the gradient vertically instead of horizontally. */
  vertical?: boolean;
};

export type LinearGradientProps = LinearGradientOwnProps &
  JSX.SvgSVGAttributes<SVGLinearGradientElement>;

export function LinearGradient(props: LinearGradientProps) {
  const merged = mergeProps(
    {
      fromOffset: "0%",
      fromOpacity: 1,
      toOffset: "100%",
      toOpacity: 1,
      vertical: true,
    },
    props
  );

  const [local, rest] = splitProps(merged, [
    "children",
    "id",
    "from",
    "to",
    "x1",
    "y1",
    "x2",
    "y2",
    "fromOffset",
    "fromOpacity",
    "toOffset",
    "toOpacity",
    "rotate",
    "transform",
    "vertical",
  ]);

  const coordinates = () => {
    let x1 = local.x1;
    let x2 = local.x2;
    let y1 = local.y1;
    let y2 = local.y2;

    if (local.vertical && !x1 && !x2 && !y1 && !y2) {
      x1 = "0";
      x2 = "0";
      y1 = "0";
      y2 = "1";
    }

    return { x1, x2, y1, y2 };
  };

  const gradientTransform = () => {
    if (local.rotate) {
      return `rotate(${local.rotate})`;
    }
    return local.transform;
  };

  return (
    <defs>
      <linearGradient
        id={local.id}
        x1={coordinates().x1}
        y1={coordinates().y1}
        x2={coordinates().x2}
        y2={coordinates().y2}
        gradientTransform={gradientTransform()}
        {...rest}
      >
        <Show
          when={!local.children}
          fallback={local.children}
        >
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
      </linearGradient>
    </defs>
  );
}
