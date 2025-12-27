import {
  type Component,
  For,
  splitProps,
  mergeProps,
  type JSX,
} from "solid-js";
import { Group } from "../Group/Group";
import type { AxisScale } from "../Axis/AxisBottom";

export type GridRowsProps = {
  scale: AxisScale;
  width: number;
  height?: number; // Not strictly needed for rows but good for consistency
  stroke?: string;
  strokeWidth?: number | string;
  strokeDasharray?: string;
  numTicks?: number;
  offset?: number;
  top?: number;
  left?: number;
} & JSX.PathSVGAttributes<SVGLineElement>;

export const GridRows: Component<GridRowsProps> = (rawProps) => {
  const props = mergeProps(
    {
      stroke: "#e2e2e2",
      strokeWidth: 1,
      offset: 0,
    },
    rawProps
  );

  const [local, rest] = splitProps(props, [
    "scale",
    "width",
    "numTicks",
    "offset",
    "top",
    "left",
  ]);

  const ticks = () => {
    const { scale, numTicks } = local;
    if (scale.ticks) return scale.ticks(numTicks);
    return scale.domain();
  };

  return (
    <Group class="visx-grid-rows" top={local.top} left={local.left}>
      <For each={ticks()}>
        {(tick) => {
          const y = (local.scale(tick) ?? 0) + local.offset;
          return <line x1={0} x2={local.width} y1={y} y2={y} {...rest} />;
        }}
      </For>
    </Group>
  );
};
