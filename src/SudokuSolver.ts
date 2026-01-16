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

  static Solve(board: SudokuBoard): void {
    console.log("Solving Board!");

  }
}
