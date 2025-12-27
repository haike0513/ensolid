import { type Component, type JSX, splitProps, createMemo } from "solid-js";
import { arc as d3Arc } from "d3-shape";

export type ArcProps = Omit<JSX.PathSVGAttributes<SVGPathElement>, "d"> & {
  data?: any;
  innerRadius?: number | ((d: any) => number);
  outerRadius?: number | ((d: any) => number);
  cornerRadius?: number | ((d: any) => number);
  startAngle?: number | ((d: any) => number);
  endAngle?: number | ((d: any) => number);
  padAngle?: number | ((d: any) => number);
  padRadius?: number | ((d: any) => number);
};

export const Arc: Component<ArcProps> = (props) => {
  const [local, rest] = splitProps(props, [
    "data",
    "innerRadius",
    "outerRadius",
    "cornerRadius",
    "startAngle",
    "endAngle",
    "padAngle",
    "padRadius",
  ]);

  const path = createMemo(() => {
    const arcGen = d3Arc<any>();

    // Config types in d3 are strict, but we allow numbers or accessors
    if (local.innerRadius !== undefined)
      arcGen.innerRadius(local.innerRadius as any);
    if (local.outerRadius !== undefined)
      arcGen.outerRadius(local.outerRadius as any);
    if (local.cornerRadius !== undefined)
      arcGen.cornerRadius(local.cornerRadius as any);
    if (local.startAngle !== undefined)
      arcGen.startAngle(local.startAngle as any);
    if (local.endAngle !== undefined) arcGen.endAngle(local.endAngle as any);
    if (local.padAngle !== undefined) arcGen.padAngle(local.padAngle as any);
    if (local.padRadius !== undefined) arcGen.padRadius(local.padRadius as any);

    return arcGen(local.data || {}) || "";
  });

  return <path d={path()} {...rest} />;
};
