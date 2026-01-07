import { type Component, For, splitProps, mergeProps } from "solid-js";
import { Group } from "../Group/Group";
import type { AxisProps } from "./AxisBottom"; // Import types

export const AxisTop: Component<AxisProps> = (rawProps) => {
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
        dy: "-0.75em", // Position label above the tick
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
    <Group class="visx-axis-top" top={local.top} left={local.left} {...rest}>
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
                  y2={-local.tickLength}
                  stroke={local.tickStroke}
                  stroke-width={local.tickStrokeWidth}
                />
              )}
              <text
                y={-local.tickLength - 5}
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
