import { useEffect } from "react";
import { useGame } from "@/hooks/useGame";
import { Grid } from "./Grid";
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

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

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
        <Button variant="outline" size="icon" onClick={resetGame}>
          <RotateCcw className="h-4 w-4" />
        </Button>
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

      <Grid grid={grid} onSwipe={handleSwipe} />

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
