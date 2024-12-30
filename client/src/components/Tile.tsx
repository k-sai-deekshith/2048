import { cn } from "@/lib/utils";

const colors: Record<number, string> = {
  2: "bg-[#eee4da] text-gray-900",
  4: "bg-[#ede0c8] text-gray-900",
  8: "bg-[#f2b179] text-white",
  16: "bg-[#f59563] text-white",
  32: "bg-[#f67c5f] text-white",
  64: "bg-[#f65e3b] text-white",
  128: "bg-[#edcf72] text-white",
  256: "bg-[#edcc61] text-white",
  512: "bg-[#edc850] text-white",
  1024: "bg-[#edc53f] text-white",
  2048: "bg-[#edc22e] text-white",
};

interface TileProps {
  value: number | null;
}

export function Tile({ value }: TileProps) {
  return (
    <div
      className={cn(
        "rounded-lg flex items-center justify-center transition-all duration-100",
        value ? colors[value] || "bg-[#3c3a32] text-white" : "bg-muted-foreground/20",
        "text-2xl md:text-3xl lg:text-4xl font-bold"
      )}
    >
      {value}
    </div>
  );
}
