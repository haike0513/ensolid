import { JSX, splitProps } from "solid-js";
import { ClipPath } from "./ClipPath";

export type CircleClipPathProps = {
  /** Unique id for the clipPath. */
  id: string;
  /** x position of the center of the ClipPath circle. */
  cx?: string | number;
  /** y position of the center of the ClipPath circle. */
  cy?: string | number;
  /** radius of the ClipPath circle. */
  r?: string | number;
} & JSX.SvgSVGAttributes<SVGCircleElement>;

/** ClipPath for clipping to the shape of a `<circle />`, pass any `<circle />` props you want. */
export function CircleClipPath(props: CircleClipPathProps) {
  const [local, rest] = splitProps(props, ["id", "cx", "cy", "r"]);

  return (
    <ClipPath id={local.id}>
      <circle cx={local.cx} cy={local.cy} r={local.r} {...rest} />
    </ClipPath>
  );
}
