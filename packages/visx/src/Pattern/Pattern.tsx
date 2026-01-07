import { JSX } from "solid-js";

export type PatternProps = {
  /** Unique id of the pattern element. */
  id: string;
  /** Width of the pattern. */
  width: number;
  /** Height of the pattern. */
  height: number;
  /** Children of pattern element to render. */
  children: JSX.Element;
};

export function Pattern(props: PatternProps) {
  return (
    <defs>
      <pattern
        id={props.id}
        width={props.width}
        height={props.height}
        patternUnits="userSpaceOnUse"
      >
        {props.children}
      </pattern>
    </defs>
  );
}
