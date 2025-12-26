import { Component, JSX, splitProps } from 'solid-js';

export type GroupProps = JSX.GSVGAttributes<SVGGElement> & {
  top?: number;
  left?: number;
};

export const Group: Component<GroupProps> = (props) => {
  const [local, rest] = splitProps(props, ['top', 'left', 'transform', 'children']);
  return (
    <g
      transform={`translate(${local.left ?? 0}, ${local.top ?? 0})${local.transform ? ` ${local.transform}` : ''}`}
      {...rest}
    >
      {local.children}
    </g>
  );
};
