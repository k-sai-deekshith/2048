import { useEffect } from "react";
import { useGame } from "@/hooks/useGame";
import { useAudio } from "@/hooks/useAudio";
import { Grid } from "./Grid";
import { AudioControls } from "./AudioControls";
import { Tutorial } from "./Tutorial";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RotateCcw } from "lucide-react";

export function Game() {
  const {
    grid,
    score,
    bestScore,
    handleKeyDown,
    handleSwipe,
    isGameOver,
    hasWon,
    resetGame,
  } = useGame();

  const audio = useAudio();

  useEffect(() => {
    const handleKeyDownWithSound = (event: KeyboardEvent) => {
      const prevGrid = JSON.stringify(grid);
      handleKeyDown(event);
      const newGrid = JSON.stringify(grid);

      if (prevGrid !== newGrid) {
        audio.playMoveSound();
        // Check if any tiles merged by comparing the number of non-null tiles
        const prevTiles = grid.flat().filter(Boolean).length;
        const newTiles = JSON.parse(newGrid).flat().filter(Boolean).length;
        if (prevTiles > newTiles) {
          audio.playMergeSound();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDownWithSound);
    return () => window.removeEventListener("keydown", handleKeyDownWithSound);
  }, [handleKeyDown, grid, audio]);

  const handleSwipeWithSound = (direction: "up" | "down" | "left" | "right") => {
    const prevGrid = JSON.stringify(grid);
    handleSwipe(direction);
    const newGrid = JSON.stringify(grid);

    if (prevGrid !== newGrid) {
      audio.playMoveSound();
      const prevTiles = grid.flat().filter(Boolean).length;
      const newTiles = JSON.parse(newGrid).flat().filter(Boolean).length;
      if (prevTiles > newTiles) {
        audio.playMergeSound();
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 max-w-md w-full">
      <div className="w-full flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            2048
          </h1>
          <p className="text-muted-foreground text-sm">
            Join the tiles, get to 2048!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AudioControls {...audio} />
          <Tutorial onClose={() => {}} />
          <Button variant="outline" size="icon" onClick={resetGame}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <div className="bg-muted rounded-lg p-4 flex-1">
          <div className="text-sm text-muted-foreground">Score</div>
          <div className="text-2xl font-bold">{score}</div>
        </div>
        <div className="bg-muted rounded-lg p-4 flex-1">
          <div className="text-sm text-muted-foreground">Best</div>
          <div className="text-2xl font-bold">{bestScore}</div>
        </div>
      </div>

      <Grid grid={grid} onSwipe={handleSwipeWithSound} />

      <Dialog open={isGameOver || hasWon} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {hasWon ? "Congratulations! 🎉" : "Game Over! 😔"}
            </DialogTitle>
            <DialogDescription>
              {hasWon
                ? "You've reached 2048! Want to keep going?"
                : "No more moves available. Try again?"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={resetGame}>New Game</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}