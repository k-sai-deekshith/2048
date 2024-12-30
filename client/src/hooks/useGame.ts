import { useState, useCallback, useEffect } from "react";
import {
  createEmptyGrid,
  addRandomTile,
  move,
  isGameOver,
  hasWon as checkWin,
} from "@/lib/gameLogic";

export function useGame() {
  const [grid, setGrid] = useState(() => {
    const emptyGrid = createEmptyGrid();
    return addRandomTile(addRandomTile(emptyGrid));
  });

  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem("bestScore");
    return saved ? parseInt(saved, 10) : 0;
  });

  const [isGameOver, setIsGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem("bestScore", score.toString());
    }
  }, [score, bestScore]);

  const makeMove = useCallback((direction: "up" | "down" | "left" | "right") => {
    if (isGameOver || hasWon) return;

    const { grid: newGrid, score: moveScore } = move(grid, direction);
    const gridWithNewTile = addRandomTile(newGrid);

    setGrid(gridWithNewTile);
    setScore(prev => prev + moveScore);

    if (checkWin(gridWithNewTile)) {
      setHasWon(true);
    } else if (isGameOver(gridWithNewTile)) {
      setIsGameOver(true);
    }
  }, [grid, isGameOver, hasWon]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (isGameOver || hasWon) return;

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
    [makeMove, isGameOver, hasWon]
  );

  const handleSwipe = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      if (isGameOver || hasWon) return;
      makeMove(direction);
    },
    [makeMove, isGameOver, hasWon]
  );

  const resetGame = useCallback(() => {
    const emptyGrid = createEmptyGrid();
    setGrid(addRandomTile(addRandomTile(emptyGrid)));
    setScore(0);
    setIsGameOver(false);
    setHasWon(false);
  }, []);

  return {
    grid,
    score,
    bestScore,
    isGameOver,
    hasWon,
    handleKeyDown,
    handleSwipe,
    resetGame,
  };
}