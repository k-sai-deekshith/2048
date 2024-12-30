export function createEmptyGrid(): (number | null)[][] {
  return Array(4).fill(null).map(() => Array(4).fill(null));
}

export function addRandomTile(grid: (number | null)[][]): (number | null)[][] {
  const emptyCells: [number, number][] = [];
  
  grid.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === null) {
        emptyCells.push([i, j]);
      }
    });
  });

  if (emptyCells.length === 0) return grid;

  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const newGrid = grid.map(row => [...row]);
  newGrid[row][col] = Math.random() < 0.9 ? 2 : 4;

  return newGrid;
}

export function move(
  grid: (number | null)[][],
  direction: "up" | "down" | "left" | "right"
): { grid: (number | null)[][]; score: number } {
  let score = 0;
  let newGrid = grid.map(row => [...row]);

  const rotate = (grid: (number | null)[][]) => {
    const N = grid.length;
    const rotated = createEmptyGrid();
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        rotated[j][N - 1 - i] = grid[i][j];
      }
    }
    return rotated;
  };

  // Normalize direction to left
  if (direction === "up") {
    newGrid = rotate(rotate(rotate(newGrid)));
  } else if (direction === "right") {
    newGrid = rotate(rotate(newGrid));
  } else if (direction === "down") {
    newGrid = rotate(newGrid);
  }

  // Merge tiles
  for (let i = 0; i < 4; i++) {
    const row = newGrid[i].filter(cell => cell !== null);
    const merged: (number | null)[] = [];
    
    for (let j = 0; j < row.length; j++) {
      if (j < row.length - 1 && row[j] === row[j + 1]) {
        const mergedValue = (row[j] as number) * 2;
        merged.push(mergedValue);
        score += mergedValue;
        j++;
      } else {
        merged.push(row[j]);
      }
    }
    
    while (merged.length < 4) {
      merged.push(null);
    }
    newGrid[i] = merged;
  }

  // Rotate back
  if (direction === "up") {
    newGrid = rotate(newGrid);
  } else if (direction === "right") {
    newGrid = rotate(rotate(newGrid));
  } else if (direction === "down") {
    newGrid = rotate(rotate(rotate(newGrid)));
  }

  return { grid: newGrid, score };
}

export function isGameOver(grid: (number | null)[][]): boolean {
  // Check for empty cells
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === null) return false;
    }
  }

  // Check for possible merges
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const current = grid[i][j];
      if (
        (i < 3 && grid[i + 1][j] === current) ||
        (j < 3 && grid[i][j + 1] === current)
      ) {
        return false;
      }
    }
  }

  return true;
}

export function hasWon(grid: (number | null)[][]): boolean {
  return grid.some(row => row.some(cell => cell === 2048));
}
