import { Component, JSX } from 'solid-js';

export type BarProps = JSX.RectSVGAttributes<SVGRectElement> & {
  x?: number;
  y?: number;
  width: number;
  height: number;
};

export const Bar: Component<BarProps> = (props) => {
  return <rect {...props} />;
};
