import { type JSX, splitProps, createMemo } from "solid-js";
import { line, type CurveFactory } from "d3-shape";

export type LinePathProps<T> = Omit<
  JSX.PathSVGAttributes<SVGPathElement>,
  "d"
> & {
  data: T[];
  x?: (d: T, index: number, data: T[]) => number;
  y?: (d: T, index: number, data: T[]) => number;
  curve?: CurveFactory;
  defined?: (d: T, index: number, data: T[]) => boolean;
};

export function LinePath<T>(props: LinePathProps<T>) {
  const [local, rest] = splitProps(props, [
    "data",
    "x",
    "y",
    "curve",
    "defined",
  ]);

  const path = createMemo(() => {
    const { data, x, y, curve, defined } = local;
    const lineGenerator = line<T>();
    if (x) lineGenerator.x(x);
    if (y) lineGenerator.y(y);
    if (curve) lineGenerator.curve(curve);
    if (defined) lineGenerator.defined(defined);

    return lineGenerator(data) || "";
  });

  return (
    <path
      d={path()}
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      {...rest}
    />
  );
}
