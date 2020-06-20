"use strict";
Array.prototype.last = function () {
    return this.last();
};
class Matrix {
    constructor(rows, columns, inputMatrix) {
        if (rows != inputMatrix.length || columns != inputMatrix[0].length) {
        }
        this.rows = rows;
        this.columns = columns;
        this.array = inputMatrix.slice();
    }
    updateEntry(row, column, value) {
        this.array[row - 1][column - 1] = value;
    }
    log() {
        console.table(this.array);
    }
    rowSwap(targetRow, actorRow) {
        targetRow -= 1;
        actorRow -= 1;
        let swapped = this.array.map(row => row.slice());
        swapped[targetRow] = this.array[actorRow].slice();
        swapped[actorRow] = this.array[targetRow].slice();
        return new Matrix(this.rows, this.columns, swapped);
    }
    rowMultiplication(targetRow, scalar) {
        targetRow -= 1;
        let multiplied = this.array.map(row => row.slice());
        multiplied[targetRow] = this.array[targetRow].map(entry => entry * scalar);
        return new Matrix(this.rows, this.columns, multiplied);
    }
    rowReplacement(targetRow, actorRow, scalar) {
        targetRow -= 1;
        actorRow -= 1;
        let result = this.array.map(row => row.slice());
        result[targetRow] = this.array[targetRow].map((entry, col) => entry + (scalar * this.array[actorRow][col]));
        return new Matrix(this.rows, this.columns, result);
    }
    getColumn(column) {
        return this.array.map(row => row[column - 1]);
    }
    getRow(row) {
        return this.array[row - 1];
    }
    ref() {
        let steps = [];
        steps.push(this);
        for (let row = 1; row <= this.rows; row++) {
        }
        return steps;
    }
}
let B = [
    [9, 8, 7],
    [6, 5, 4],
    [3, 2, 1]
];
let matrixB = new Matrix(3, 3, B);
matrixB.log();
