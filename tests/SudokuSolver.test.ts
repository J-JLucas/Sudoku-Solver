import test from "node:test";
import assert from "node:assert/strict";
import { SudokuBoard } from "../src/SudokuBoard.js";
import { SudokuSolver } from "../src/SudokuSolver.js";
import type { CellValue } from "../src/types.js";

test("SudokuSolver: accepts empty board", () => {
  const b = new SudokuBoard();
  assert.equal(SudokuSolver.validateBoardState(b), true);
});


test("SudokuSolver: rejects duplicate in a row", () => {
  const grid: CellValue[][] = Array.from({ length: 9 }, () => Array(9).fill(null));
  grid[0][0] = 5;
  grid[0][3] = 5;

  const b = new SudokuBoard(grid);
  assert.equal(SudokuSolver.validateBoardState(b), false);
});


test("SudokuSolver: rejects duplicate in a column", () => {
  const grid: CellValue[][] = Array.from({ length: 9 }, () => Array(9).fill(null));
  grid[0][0] = 7;
  grid[4][0] = 7; // same column 0

  const b = new SudokuBoard(grid);
  assert.equal(SudokuSolver.validateBoardState(b), false);
});


test("SudokuSolver: rejects duplicate in a 3x3 subgrid", () => {
  const grid: CellValue[][] = Array.from({ length: 9 }, () => Array(9).fill(null));
  grid[0][0] = 9;
  grid[1][2] = 9; // still in the top-left 3x3

  const b = new SudokuBoard(grid);
  assert.equal(SudokuSolver.validateBoardState(b), false);
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
  assert.equal(SudokuSolver.validateBoardState(b), true);
});


test("SudokuSolver: validate NeetCode board state (expected true)", () => {
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
  assert.equal(SudokuSolver.validateBoardState(b), true);
});


test("SudokuSolver: validate NeetCode board state (expected false)", () => {
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
  assert.equal(SudokuSolver.validateBoardState(b), false);
});

test("SudokuSolver: validate SudokuSpoiler.com solved board state (expected true)", () => {
  const grid: CellValue[][] = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ];

  const b = new SudokuBoard(grid);
  assert.equal(SudokuSolver.validateBoardState(b), true);
});

test("SudokuSolver: solve  board (expected true)", () => {

  const input: CellValue[][] = [
    [5, 3, null, null, 7, null, null, null, null],
    [6, null, null, 1, 9, 5, null, null, null],
    [null, 9, 8, null, null, null, null, 6, null],
    [8, null, null, null, 6, null, null, null, 3],
    [4, null, null, 8, null, 3, null, null, 1],
    [7, null, null, null, 2, null, null, null, 6],
    [null, 6, null, null, null, null, 2, 8, null],
    [null, null, null, 4, 1, 9, null, null, 5],
    [null, null, null, null, 8, null, null, 7, 9]
  ];

  const solution: CellValue[][] = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
  ];

  const i = new SudokuBoard(input);
  const s = new SudokuBoard(solution);
  SudokuSolver.Solve(i);

  assert.equal(i.isEqual(s), true);
});

