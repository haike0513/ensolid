import { Component, For, splitProps, mergeProps, JSX } from 'solid-js';
import { Group } from '../Group/Group';
import { AxisScale } from '../Axis/AxisBottom';

export type GridColumnsProps = {
  scale: AxisScale;
  height: number;
  width?: number; // Not strictly needed for cols but good for consistency
  stroke?: string;
  strokeWidth?: number | string;
  strokeDasharray?: string;
  numTicks?: number;
  offset?: number;
  top?: number;
  left?: number;
} & JSX.PathSVGAttributes<SVGLineElement>;

export const GridColumns: Component<GridColumnsProps> = (rawProps) => {
    const props = mergeProps({
        stroke: '#e2e2e2',
        strokeWidth: 1,
        offset: 0,
    }, rawProps);

    const [local, rest] = splitProps(props, ['scale', 'height', 'numTicks', 'offset', 'top', 'left']);

  const ticks = () => {
    const { scale, numTicks } = local;
    if (scale.ticks) return scale.ticks(numTicks);
    return scale.domain();
  };

  return (
    <Group class="visx-grid-columns" top={local.top} left={local.left}>
        <For each={ticks()}>
            {(tick) => {
                const x = (local.scale(tick) ?? 0) + local.offset;
                return (
                    <line
                        x1={x}
                        x2={x}
                        y1={0}
                        y2={local.height}
                        {...rest}
                    />
                )
            }}
        </For>
    </Group>
  );
};
