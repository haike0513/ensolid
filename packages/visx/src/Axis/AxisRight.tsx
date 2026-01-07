import { type Component, For, splitProps, mergeProps } from "solid-js";
import { Group } from "../Group/Group";
import type { AxisProps } from "./AxisBottom"; // Import types

export const AxisRight: Component<AxisProps> = (rawProps) => {
  const props = mergeProps(
    {
      tickLength: 8,
      stroke: "#333",
      strokeWidth: 1,
      tickStroke: "#333",
      tickLabelProps: () => ({
        "text-anchor": "start" as const,
        "font-size": "10px",
        "font-family": "sans-serif",
        fill: "#333",
        dy: "0.25em",
        dx: "0.25em",
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
    <Group class="visx-axis-right" top={local.top} left={local.left} {...rest}>
      {!local.hideAxisLine && (
        <line
          x1={0}
          x2={0}
          y1={Math.min(...range())}
          y2={Math.max(...range())}
          stroke={local.stroke}
          stroke-width={local.strokeWidth}
        />
      )}
      <For each={ticks()}>
        {(tick, i) => {
          const y = (local.scale(tick) ?? 0) + offset();
          return (
            <Group transform={`translate(0, ${y})`}>
              {!local.hideTicks && (
                <line
                  x2={local.tickLength}
                  stroke={local.tickStroke}
                  stroke-width={local.tickStrokeWidth}
                />
              )}
              <text
                x={local.tickLength + 5}
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
