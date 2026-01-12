import test from "node:test";
import assert from "node:assert/strict";
import { SudokuBoard } from "../SudokuBoard.js";
import { SudokuSolver } from "../SudokuSolver.js";
import type { CellValue } from "../types.js";

test("SudokuSolver: accepts empty board", () => {
  const b = new SudokuBoard();
  const s = new SudokuSolver();
  assert.equal(s.validateBoardState(b), true);
});


test("SudokuSolver: rejects duplicate in a row", () => {
  const grid: CellValue[][] = Array.from({ length: 9 }, () => Array(9).fill(null));
  grid[0][0] = 5;
  grid[0][3] = 5;

  const b = new SudokuBoard(grid);
  const s = new SudokuSolver();
  assert.equal(s.validateBoardState(b), false);
});


test("SudokuSolver: rejects duplicate in a column", () => {
  const grid: CellValue[][] = Array.from({ length: 9 }, () => Array(9).fill(null));
  grid[0][0] = 7;
  grid[4][0] = 7; // same column 0

  const b = new SudokuBoard(grid);
  const s = new SudokuSolver();
  assert.equal(s.validateBoardState(b), false);
});


test("SudokuSolver: rejects duplicate in a 3x3 subgrid", () => {
  const grid: CellValue[][] = Array.from({ length: 9 }, () => Array(9).fill(null));
  grid[0][0] = 9;
  grid[1][2] = 9; // still in the top-left 3x3

  const b = new SudokuBoard(grid);
  const s = new SudokuSolver();
  assert.equal(s.validateBoardState(b), false);
});


test("SudokuSolver: accepts a valid partially-filled board", () => {
  const grid: CellValue[][] = Array.from({ length: 9 }, () => Array(9).fill(null));

  // place some values that are valid together
  grid[0][0] = 5;
  grid[0][4] = 3;
  grid[1][1] = 6;
  grid[4][4] = 7;
  grid[8][8] = 9;

  const b = new SudokuBoard(grid);
  const s = new SudokuSolver();
  assert.equal(s.validateBoardState(b), true);
});


test("SudokuSolver: NeetCode board fixture (expected true)", () => {
  const grid: CellValue[][] = [
    [1, 2, null, null, 3, null, null, null, null],
    [4, null, null, 5, null, null, null, null, null],
    [null, 9, 8, null, null, null, null, null, 3],
    [5, null, null, null, 6, null, null, null, 4],
    [null, null, null, 8, null, 3, null, null, 5],
    [7, null, null, null, 2, null, null, null, 6],
    [null, null, null, null, null, null, 2, null, null],
    [null, null, null, 4, 1, 9, null, null, 8],
    [null, null, null, null, 8, null, null, 7, 9],
  ];

  const b = new SudokuBoard(grid);
  const s = new SudokuSolver();
  assert.equal(s.validateBoardState(b), true);
});


test("SudokuSolver: NeetCode board fixture (expected false)", () => {
  const grid: CellValue[][] = [
    [1, 2, null, null, 3, null, null, null, null],
    [4, null, null, 5, null, null, null, null, null],
    [null, 9, 1, null, null, null, null, null, 3], // changed 8 -> 1
    [5, null, null, null, 6, null, null, null, 4],
    [null, null, null, 8, null, 3, null, null, 5],
    [7, null, null, null, 2, null, null, null, 6],
    [null, null, null, null, null, null, 2, null, null],
    [null, null, null, 4, 1, 9, null, null, 8],
    [null, null, null, null, 8, null, null, 7, 9],
  ];

  const b = new SudokuBoard(grid);
  const s = new SudokuSolver();
  assert.equal(s.validateBoardState(b), false);
});
