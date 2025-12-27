import {
  type Component,
  For,
  type JSX,
  splitProps,
  mergeProps,
} from "solid-js";
import { Group } from "../Group/Group";

// Simplified Scale type definition suitable for d3-scale interactions
export interface AxisScale<Output = number> {
  (value: any): Output | undefined;
  domain: () => any[];
  range: () => Output[];
  ticks?: (count?: number) => any[];
  tickFormat?: (count?: number, specifier?: string) => (d: any) => string;
  bandwidth?: () => number;
}

export type AxisProps = {
  scale: AxisScale;
  top?: number;
  left?: number;
  hideAxisLine?: boolean;
  hideTicks?: boolean;
  tickLength?: number;
  tickLabelProps?: (
    value: any,
    index: number
  ) => JSX.TextSVGAttributes<SVGTextElement>;
  stroke?: string;
  strokeWidth?: number;
  tickStroke?: string;
  tickStrokeWidth?: number;
  numTicks?: number;
  tickFormat?: (value: any, index: number) => string;
} & Omit<JSX.GSVGAttributes<SVGGElement>, "scale">;

export const AxisBottom: Component<AxisProps> = (rawProps) => {
  const props = mergeProps(
    {
      tickLength: 8,
      stroke: "#333",
      strokeWidth: 1,
      tickStroke: "#333",
      tickLabelProps: () => ({
        "text-anchor": "middle" as const,
        "font-size": "10px",
        "font-family": "sans-serif",
        fill: "#333",
        dy: "0.71em", // standard vertical alignment
      }),
    },
    rawProps
  );

  const [local, rest] = splitProps(props, [
    "scale",
    "top",
    "left",
    "hideAxisLine",
    "hideTicks",
    "tickLength",
    "tickLabelProps",
    "stroke",
    "strokeWidth",
    "tickStroke",
    "tickStrokeWidth",
    "numTicks",
    "tickFormat",
  ]);

  const ticks = () => {
    const { scale, numTicks } = local;
    if (scale.ticks) return scale.ticks(numTicks);
    return scale.domain();
  };

  const formatTick = (tick: any, index: number) => {
    const { scale, tickFormat, numTicks } = local;
    if (tickFormat) return tickFormat(tick, index);
    if (scale.tickFormat) return scale.tickFormat(numTicks)(tick);
    return String(tick);
  };

  const offset = () => {
    const { scale } = local;
    if (scale.bandwidth) return scale.bandwidth() / 2;
    return 0;
  };

  const range = () => local.scale.range();

  return (
    <Group class="visx-axis-bottom" top={local.top} left={local.left} {...rest}>
      {!local.hideAxisLine && (
        <line
          x1={Math.min(...range())}
          x2={Math.max(...range())}
          y1={0}
          y2={0}
          stroke={local.stroke}
          stroke-width={local.strokeWidth}
        />
      )}
      <For each={ticks()}>
        {(tick, i) => {
          const x = (local.scale(tick) ?? 0) + offset();
          return (
            <Group transform={`translate(${x}, 0)`}>
              {!local.hideTicks && (
                <line
                  y2={local.tickLength}
                  stroke={local.tickStroke}
                  stroke-width={local.tickStrokeWidth}
                />
              )}
              <text
                y={local.tickLength + 5}
                {...local.tickLabelProps(tick, i())}
              >
                {formatTick(tick, i())}
              </text>
            </Group>
          );
        }}
      </For>
    </Group>
  );
};
