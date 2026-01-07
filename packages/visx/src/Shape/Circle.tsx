import { JSX, splitProps } from "solid-js";
import clsx from "clsx";

export type CircleProps = {
  /** className to apply to circle element. */
  class?: string;
} & JSX.SvgSVGAttributes<SVGCircleElement>;

export function Circle(props: CircleProps) {
  const [local, rest] = splitProps(props, ["class"]);
  
  return (
    <circle
      class={clsx("visx-circle", local.class)}
      {...rest}
    />
  );
}
