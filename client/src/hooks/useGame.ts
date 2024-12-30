import { useState, useCallback, useEffect } from "react";
import {
  createEmptyGrid,
  addRandomTile,
  move,
  isGameOver as checkGameOver,
  hasWon as checkWin,
  createDailyChallenge,
} from "@/lib/gameLogic";

export function useGame(isDailyChallenge = false) {
  const [grid, setGrid] = useState(() => {
    if (isDailyChallenge) {
      return createDailyChallenge();
    }
    const emptyGrid = createEmptyGrid();
    return addRandomTile(addRandomTile(emptyGrid));
  });

  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem("bestScore");
    return saved ? parseInt(saved, 10) : 0;
  });

  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem("bestScore", score.toString());
    }
  }, [score, bestScore]);

  const makeMove = useCallback((direction: "up" | "down" | "left" | "right") => {
    if (gameOver || hasWon) return;

    const { grid: newGrid, score: moveScore } = move(grid, direction);
    const gridWithNewTile = addRandomTile(newGrid);

    setGrid(gridWithNewTile);
    setScore(prev => prev + moveScore);

    if (checkWin(gridWithNewTile)) {
      setHasWon(true);
    } else if (checkGameOver(gridWithNewTile)) {
      setGameOver(true);
    }
  }, [grid, gameOver, hasWon]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (gameOver || hasWon) return;

      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          makeMove("up");
          break;
        case "ArrowDown":
          event.preventDefault();
          makeMove("down");
          break;
        case "ArrowLeft":
          event.preventDefault();
          makeMove("left");
          break;
        case "ArrowRight":
          event.preventDefault();
          makeMove("right");
          break;
      }
    },
    [makeMove, gameOver, hasWon]
  );

  const handleSwipe = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      if (gameOver || hasWon) return;
      makeMove(direction);
    },
    [makeMove, gameOver, hasWon]
  );

  const resetGame = useCallback(() => {
    const emptyGrid = isDailyChallenge ? createDailyChallenge() : createEmptyGrid();
    setGrid(isDailyChallenge ? emptyGrid : addRandomTile(addRandomTile(emptyGrid)));
    setScore(0);
    setGameOver(false);
    setHasWon(false);
  }, [isDailyChallenge]);

  return {
    grid,
    score,
    bestScore,
    isGameOver: gameOver,
    hasWon,
    handleKeyDown,
    handleSwipe,
    resetGame,
  };
}