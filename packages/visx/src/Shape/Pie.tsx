import { JSX, splitProps, createMemo, mergeProps } from 'solid-js';
import { pie as d3Pie, PieArcDatum } from 'd3-shape';
import { Group } from '../Group/Group';

export type PieProps<T> = {
  data: T[];
  children: (arcs: PieArcDatum<T>[]) => JSX.Element;
  value?: (d: T, index: number, data: T[]) => number;
  sort?: ((a: T, b: T) => number) | null;
  sortValues?: ((a: number, b: number) => number) | null;
  startAngle?: number;
  endAngle?: number;
  padAngle?: number;
  top?: number;
  left?: number;
};

export function Pie<T>(props: PieProps<T>) {
  const [local, rest] = splitProps(props, [
    'data',
    'children',
    'value',
    'sort',
    'sortValues',
    'startAngle',
    'endAngle',
    'padAngle',
    'top',
    'left'
  ]);

  const arcs = createMemo(() => {
    const pieGen = d3Pie<T>();
    if (local.value) pieGen.value(local.value);
    if (local.sort !== undefined) {
        if (local.sort === null) pieGen.sort(null);
        else pieGen.sort(local.sort);
    }
    if (local.sortValues !== undefined) {
         if (local.sortValues === null) pieGen.sortValues(null);
         else pieGen.sortValues(local.sortValues);
    }
    if (local.startAngle !== undefined) pieGen.startAngle(local.startAngle);
    if (local.endAngle !== undefined) pieGen.endAngle(local.endAngle);
    if (local.padAngle !== undefined) pieGen.padAngle(local.padAngle);
    
    return pieGen(local.data);
  });

  return (
    <Group top={local.top} left={local.left}>
      {local.children(arcs())}
    </Group>
  );
}
