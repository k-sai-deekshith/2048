import { useState, useEffect } from "react";
import { Grid } from "./Grid";
import { useGame } from "@/hooks/useGame";
import { Button } from "@/components/ui/button";
import { CalendarDays, Trophy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface DailyChallengeStats {
  date: string;
  attempts: number;
  bestScore: number;
}

export function DailyChallenge() {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState<DailyChallengeStats>(() => {
    const saved = localStorage.getItem("dailyStats");
    return saved ? JSON.parse(saved) : { date: "", attempts: 0, bestScore: 0 };
  });

  const {
    grid,
    score,
    handleKeyDown,
    handleSwipe,
    isGameOver,
    hasWon,
    resetGame,
  } = useGame(true); // true indicates daily challenge mode

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (stats.date !== today) {
      setStats({ date: today, attempts: 0, bestScore: 0 });
    }
  }, []);

  useEffect(() => {
    if (isGameOver || hasWon) {
      const today = new Date().toISOString().split('T')[0];
      const newStats = {
        date: today,
        attempts: stats.attempts + 1,
        bestScore: Math.max(stats.bestScore, score),
      };
      setStats(newStats);
      localStorage.setItem("dailyStats", JSON.stringify(newStats));
    }
  }, [isGameOver, hasWon, score]);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="h-8 w-8"
      >
        <CalendarDays className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Daily Challenge</DialogTitle>
            <DialogDescription>
              Everyone gets the same puzzle today. Can you solve it?
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-4 mb-4">
            <div className="bg-muted rounded-lg p-4 flex-1">
              <div className="text-sm text-muted-foreground">Attempts Today</div>
              <div className="text-2xl font-bold">{stats.attempts}</div>
            </div>
            <div className="bg-muted rounded-lg p-4 flex-1">
              <div className="text-sm text-muted-foreground">Best Score</div>
              <div className="text-2xl font-bold">{stats.bestScore}</div>
            </div>
          </div>

          <Grid grid={grid} onSwipe={handleSwipe} />

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              Current Score: {score}
            </div>
            <Button onClick={resetGame}>Try Again</Button>
          </div>

          {(isGameOver || hasWon) && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">Game Complete!</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {hasWon
                  ? "Congratulations! You've beaten today's challenge!"
                  : `Game Over! Final score: ${score}`}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}