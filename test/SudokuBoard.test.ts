import test from "node:test";
import assert from "node:assert/strict";
import { SudokuBoard } from "../SudokuBoard.js";
import type { CellValue } from "../types.js";

test("SudokuBoard: default constructor builds a 9x9 null grid", () => {
  const b = new SudokuBoard();
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      assert.equal(b.getCell(i, j), null);
    }
  }
});


test("SudokuBoard: constructor copies initial grid (no aliasing)", () => {
  const initial: CellValue[][] = Array.from({ length: 9 }, () => Array(9).fill(null));
  initial[0][0] = 1;

  const b = new SudokuBoard(initial);
  initial[0][0] = 2; // mutate original after construction

  assert.equal(b.getCell(0, 0), 1); // should NOT change
});


test("SudokuBoard: clone creates an independent copy", () => {
  const b1 = new SudokuBoard();
  b1.setCell(5, 0, 0);

  const b2 = b1.clone();
  b2.setCell(6, 0, 0);

  assert.equal(b1.getCell(0, 0), 5);
  assert.equal(b2.getCell(0, 0), 6);
});


test("SudokuBoard: constructor rejects invalid height", () => {
  const bad: CellValue[][] = [];
  assert.throws(() => new SudokuBoard(bad), /Invalid board height/);
});


test("SudokuBoard: constructor rejects invalid width", () => {
  const bad: CellValue[][] = Array.from({ length: 9 }, () => [null]); // width 1
  assert.throws(() => new SudokuBoard(bad), /Invalid board width/);
});


test("SudokuBoard: setCell returns false when out of bounds", () => {
  const b = new SudokuBoard();
  assert.equal(b.setCell(1, -1, 0), false);
  assert.equal(b.setCell(1, 0, 9), false);
});


test("SudokuBoard: setCell writes value and returns true", () => {
  const b = new SudokuBoard();
  const ok = b.setCell(7, 3, 4);

  assert.equal(ok, true);
  assert.equal(b.getCell(3, 4), 7);
});


test("SudokuBoard: setCell can clear a cell back to null", () => {
  const b = new SudokuBoard();
  b.setCell(9, 0, 0);
  assert.equal(b.getCell(0, 0), 9);

  b.setCell(null, 0, 0);
  assert.equal(b.getCell(0, 0), null);
});


test("SudokuBoard: getCell throws when out of bounds", () => {
  const b = new SudokuBoard();
  assert.throws(() => b.getCell(-1, 0), /out of bounds/i);
});
