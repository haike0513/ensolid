import { JSX, mergeProps } from "solid-js";
import clsx from "clsx";

interface Point {
  x?: number;
  y?: number;
}

export type LineProps = {
  /** className to apply to line element. */
  class?: string;
  /** fill color applied to line element. */
  fill?: string;
  /** Starting x,y point of the line. */
  from?: Point;
  /** Ending x,y point of the line. */
  to?: Point;
} & JSX.SvgSVGAttributes<SVGLineElement>;

export function Line(props: LineProps) {
  const merged = mergeProps(
    {
      from: { x: 0, y: 0 },
      to: { x: 1, y: 1 },
      fill: "transparent",
    },
    props
  );

  const isRectilinear = () =>
    merged.from.x === merged.to.x || merged.from.y === merged.to.y;

  return (
    <line
      class={clsx("visx-line", merged.class)}
      x1={merged.from.x}
      y1={merged.from.y}
      x2={merged.to.x}
      y2={merged.to.y}
      fill={merged.fill}
      shape-rendering={isRectilinear() ? "crispEdges" : "auto"}
      {...props}
    />
  );
}
