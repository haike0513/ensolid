import type { Component } from "solid-js";
import { For, createMemo } from "solid-js";
import { Group } from "@ensolid/visx";
import { scaleLinear } from "d3-scale";

// Data points: a + b + c = 100% ideally, normalized in component
const data = [
  { a: 20, b: 20, c: 60, label: "Point 1" },
  { a: 50, b: 30, c: 20, label: "Point 2" },
  { a: 10, b: 80, c: 10, label: "Point 3" },
  { a: 33, b: 33, c: 33, label: "Point 4" },
  { a: 80, b: 10, c: 10, label: "Point 5" },
];

export const TernaryPlot: Component = () => {
  const width = 450;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 40, left: 20 };
  const side = Math.min(width, height) - 60;
  const h = side * (Math.sqrt(3) / 2);
  
  // Triangle vertices
  const cornerA = { x: side / 2, y: 0, label: "A" }; // Top
  const cornerB = { x: 0, y: h, label: "B" };       // Bottom Left
  const cornerC = { x: side, y: h, label: "C" };    // Bottom Right

  // Coordinate conversion
  // We use simpler Barycentric-like coord mapping to cartesian
  // A is 100% at top. B is 100% at bottom-left. C is 100% at bottom-right.
  const getCoords = (a: number, b: number, c: number) => {
    const sum = a + b + c;
    const aNorm = a / sum;
    const bNorm = b / sum;
    const cNorm = c / sum;

    // x = 0.5 * (2*b + c) / (a+b+c) -> No, standard formula:
    // x = a*xA + b*xB + c*xC
    // y = a*yA + b*yB + c*yC
    const x = aNorm * cornerA.x + bNorm * cornerB.x + cNorm * cornerC.x;
    const y = aNorm * cornerA.y + bNorm * cornerB.y + cNorm * cornerC.y;
    return { x, y };
  };

  // Generate grid lines (e.g., at 20%, 40%, 60%, 80%)
  const gridLines = [];
  for (let i = 0.2; i < 1; i += 0.2) {
    // a = constant line
    // i is the value of a. It goes from B-C line (a=0) up to A (a=1)
    // Actually easier to interpolate between edges
    
    // Line for fixed A
    // Starts at AB edge where a=i, b=1-i, c=0
    // Ends at AC edge where a=i, c=1-i, b=0
    const startA = getCoords(i, 1-i, 0);
    const endA = getCoords(i, 0, 1-i);
    gridLines.push({ p1: startA, p2: endA, type: 'a', val: i });

    // Line for fixed B
    const startB = getCoords(1-i, i, 0);
    const endB = getCoords(0, i, 1-i);
    gridLines.push({ p1: startB, p2: endB, type: 'b', val: i });

    // Line for fixed C
    const startC = getCoords(1-i, 0, i);
    const endC = getCoords(0, 1-i, i);
    gridLines.push({ p1: startC, p2: endC, type: 'c', val: i });
  }

  return (
    <div class="group relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-teal-500/20 to-green-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="relative bg-card border-2 border-muted rounded-2xl p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-teal-500/30">
        <div class="flex items-center gap-3 mb-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-green-500/20">
            <span class="text-2xl">🔺</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent">
              三元图
            </h2>
            <p class="text-xs text-muted-foreground">
              Ternary Plot - 三维占比分析
            </p>
          </div>
        </div>
        <div class="flex justify-center overflow-x-auto w-full">
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            class="max-w-full h-auto"
          >
            <Group left={(width - side) / 2} top={20}>
              {/* Triangle Frame */}
              <path
                d={`M${cornerA.x},${cornerA.y} L${cornerB.x},${cornerB.y} L${cornerC.x},${cornerC.y} Z`}
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="text-foreground"
              />
              
              {/* Labels */}
              <text x={cornerA.x} y={cornerA.y - 10} text-anchor="middle" font-weight="bold" font-size="12">A</text>
              <text x={cornerB.x - 10} y={cornerB.y + 10} text-anchor="end" font-weight="bold" font-size="12">B</text>
              <text x={cornerC.x + 10} y={cornerC.y + 10} text-anchor="start" font-weight="bold" font-size="12">C</text>

              {/* Grid Lines */}
              <For each={gridLines}>
                {(line) => (
                  <line
                    x1={line.p1.x}
                    y1={line.p1.y}
                    x2={line.p2.x}
                    y2={line.p2.y}
                    stroke="currentColor"
                    stroke-opacity="0.1"
                  />
                )}
              </For>

              {/* Data Points */}
              <For each={data}>
                {(d) => {
                  const pos = getCoords(d.a, d.b, d.c);
                  return (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={6}
                      fill="#10b981"
                      fill-opacity={0.8}
                      stroke="#fff"
                      stroke-width={2}
                      class="transition-all duration-300 hover:scale-150 hover:fill-teal-500 cursor-pointer"
                    >
                      <title>{`${d.label}: A=${d.a}, B=${d.b}, C=${d.c}`}</title>
                    </circle>
                  );
                }}
              </For>
            </Group>
          </svg>
        </div>
      </div>
    </div>
  );
};
