import type { CellValue } from "./types";

class SudokuBoard {
  private grid: CellValue[][];

  constructor(initial?: CellValue[][]) {
    // copy a predefined board
    if (initial !== undefined) {
      if (initial.length !== 9) {
        throw new Error("Invalid board height");
      }

      this.grid = initial.map(row => {
        if (row.length !== 9) {
          throw new Error("Invalid board width");
        }
        return row.slice();
      });
      return;
    }

    // construct blank board
    this.grid = [];
    for (let i = 0; i < 9; i++) {
      const row: CellValue[] = [null, null, null,
        null, null, null,
        null, null, null];
      this.grid.push(row);
    }
  }

  // returns specified cell's value from the board grid
  getCell(i: number, j: number): CellValue {
    if (i < 0 || i >= 9 || j < 0 || j >= 9) {
      throw new RangeError("Cell index out of bounds");
    }
    return this.grid[i][j];
  }

  // returns true on success, false otherwise
  setCell(value: CellValue, i: number, j: number): boolean {
    if (i < 0 || i >= 9 || j < 0 || j >= 9) { return false; }

    this.grid[i][j] = value;
    return true;
  }

  clone(): SudokuBoard {
    return new SudokuBoard(this.grid);
  }

}
