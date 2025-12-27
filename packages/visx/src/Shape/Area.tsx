import { type JSX, splitProps, createMemo } from "solid-js";
import { area, type CurveFactory } from "d3-shape";

export type AreaProps<T> = Omit<JSX.PathSVGAttributes<SVGPathElement>, "d"> & {
  data: T[];
  x?: (d: T, index: number, data: T[]) => number;
  x0?: (d: T, index: number, data: T[]) => number;
  x1?: (d: T, index: number, data: T[]) => number;
  y?: (d: T, index: number, data: T[]) => number;
  y0?: (d: T, index: number, data: T[]) => number;
  y1?: (d: T, index: number, data: T[]) => number;
  curve?: CurveFactory;
  defined?: (d: T, index: number, data: T[]) => boolean;
};

export function Area<T>(props: AreaProps<T>) {
  const [local, rest] = splitProps(props, [
    "data",
    "x",
    "x0",
    "x1",
    "y",
    "y0",
    "y1",
    "curve",
    "defined",
  ]);

  const path = createMemo(() => {
    const { data, x, x0, x1, y, y0, y1, curve, defined } = local;
    const areaGenerator = area<T>();

    if (x) areaGenerator.x(x);
    if (x0) areaGenerator.x0(x0);
    if (x1) areaGenerator.x1(x1);
    if (y) areaGenerator.y(y);
    if (y0) areaGenerator.y0(y0);
    if (y1) areaGenerator.y1(y1);
    if (curve) areaGenerator.curve(curve);
    if (defined) areaGenerator.defined(defined);

    return areaGenerator(data) || "";
  });

  return <path d={path()} {...rest} />;
}
