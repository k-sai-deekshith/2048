import { useRef } from "react";
import { Tile } from "./Tile";
import { useDrag } from "@use-gesture/react";

interface GridProps {
  grid: (number | null)[][];
  onSwipe: (direction: "up" | "down" | "left" | "right") => void;
}

export function Grid({ grid, onSwipe }: GridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const bind = useDrag(
    ({ movement: [mx, my], distance, direction: [dx, dy], tap }) => {
      if (tap || (typeof distance === 'number' && distance < 20)) return;

      if (Math.abs(dx) > Math.abs(dy)) {
        onSwipe(dx > 0 ? "right" : "left");
      } else {
        onSwipe(dy > 0 ? "down" : "up");
      }
    },
    {
      filterTaps: true,
      threshold: 10,
    }
  );

  return (
    <div
      ref={containerRef}
      {...bind()}
      className="bg-muted rounded-xl p-3 aspect-square w-full touch-none"
    >
      <div className="grid grid-cols-4 gap-3 h-full">
        {grid.map((row, i) =>
          row.map((value, j) => (
            <Tile key={`${i}-${j}`} value={value} />
          ))
        )}
      </div>
    </div>
  );
}