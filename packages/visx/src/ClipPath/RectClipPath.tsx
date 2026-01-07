import { JSX, splitProps } from "solid-js";
import { ClipPath } from "./ClipPath";

export type RectClipPathProps = {
  /** Unique id for the clipPath. */
  id: string;
  /** x position of the ClipPath rect. */
  x?: string | number;
  /** y position of the ClipPath rect. */
  y?: string | number;
  /** width of the ClipPath rect. */
  width?: string | number;
  /** height of the ClipPath rect. */
  height?: string | number;
} & JSX.SvgSVGAttributes<SVGRectElement>;

/** ClipPath for clipping to the shape of a `<rect />`, pass any `<rect />` props you want. */
export function RectClipPath(props: RectClipPathProps) {
  const [local, rest] = splitProps(props, ["id", "x", "y", "width", "height"]);

  return (
    <ClipPath id={local.id}>
      <rect
        x={local.x}
        y={local.y}
        width={local.width}
        height={local.height}
        {...rest}
      />
    </ClipPath>
  );
}
