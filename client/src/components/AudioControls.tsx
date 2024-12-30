import { Volume2, VolumeX, Music, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AudioControlsProps {
  isMusicEnabled: boolean;
  isSoundEnabled: boolean;
  volume: number;
  toggleMusic: () => void;
  toggleSound: () => void;
  setVolume: (volume: number) => void;
}

export function AudioControls({
  isMusicEnabled,
  isSoundEnabled,
  volume,
  toggleMusic,
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
              onClick={toggleMusic}
              className="h-8 w-8"
            >
              {isMusicEnabled ? (
                <Music className="h-4 w-4" />
              ) : (
                <Music2 className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{`${isMusicEnabled ? 'Disable' : 'Enable'} music`}</p>
          </TooltipContent>
        </Tooltip>

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