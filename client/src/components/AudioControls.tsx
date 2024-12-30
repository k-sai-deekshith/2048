import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AudioControlsProps {
  isSoundEnabled: boolean;
  volume: number;
  toggleSound: () => void;
  setVolume: (volume: number) => void;
}

export function AudioControls({
  isSoundEnabled,
  volume,
  toggleSound,
  setVolume,
}: AudioControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSound}
              className="h-8 w-8"
            >
              {isSoundEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{`${isSoundEnabled ? 'Disable' : 'Enable'} sound effects`}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="w-24">
        <Slider
          value={[volume]}
          min={0}
          max={1}
          step={0.1}
          onValueChange={([value]) => setVolume(value)}
        />
      </div>
    </div>
  );
}