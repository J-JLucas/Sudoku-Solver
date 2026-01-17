import type { CellValue } from "./types.js";
import { SudokuBoard } from "./SudokuBoard.js";

export class SudokuSolver {

  static validateBoardState(board: SudokuBoard): boolean {
    const M = 9;
    const N = 9;

    // check row by row
    for (let i = 0; i < M; i++) {
      const seen = new Map<CellValue, number>();
      for (let j = 0; j < N; j++) {
        const val = board.getCell(i, j);
        if (val === null) continue;  //ignore empty cells

        // if next > 1 we've seen the value before -> illegal 
        const prev = seen.get(val) ?? 0;
        const next = prev + 1;
        if (next > 1) return false;

        seen.set(val, next);
      }
    }

    // check column by column
    for (let j = 0; j < N; j++) {
      const seen = new Map<CellValue, number>();
      for (let i = 0; i < M; i++) {
        const val = board.getCell(i, j);
        if (val === null) continue;

        const prev = seen.get(val) ?? 0;
        const next = prev + 1;
        if (next > 1) return false;

        seen.set(val, next);
      }
    }

    // check subboards
    for (let s = 0; s < 3; s++) {
      for (let t = 0; t < 3; t++) {
        const seen = new Map<CellValue, number>();
        for (let i = s * 3; i < s * 3 + 3; i++) {
          for (let j = t * 3; j < t * 3 + 3; j++) {
            let val = board.getCell(i, j);
            if (val === null) continue;

            const prev = seen.get(val) ?? 0;
            const next = prev + 1;
            if (next > 1) return false;

            seen.set(val, next);
          }
        }
      }
    }

    return true;
  }

  // capture which cells are currently filled (hints)
  private static captureFixedCells(board: SudokuBoard): boolean[][] {
    const fixed: boolean[][] = [];
    for (let i = 0; i < 9; i++) {
      const row: boolean[] = [];
      for (let j = 0; j < 9; j++) {
        row.push(board.getCell(i, j) !== null);
      }
      fixed.push(row);
    }
    return fixed;
  }

  // internal recursive solve with fixed cells
  private static solveRecursive(board: SudokuBoard, fixed: boolean[][]): boolean {
    for (let idx = 0; idx < 81; idx++) {
      const i = Math.floor(idx / 9);
      const j = idx % 9;

      if (fixed[i][j]) continue; // skip hint cells
      if (board.getCell(i, j) !== null) continue;
      for (let value = 1; value <= 9; value++) {
        board.setCell(value as CellValue, i, j);
        if (this.validateBoardState(board)) {
          if (this.solveRecursive(board, fixed)) return true;
        }
      }
      board.setCell(null, i, j); // backtrack
      return false;
    }
    return true; // board is complete
  }

  // public solve function
  static solve(board: SudokuBoard): boolean {
    // first, validate the initial board state
    if (!this.validateBoardState(board)) {
      return false; // invalid starting position
    }

    // capture which cells are hints
    const fixed = this.captureFixedCells(board);

    // solve the board
    return this.solveRecursive(board, fixed);
  }
}
