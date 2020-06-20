"use strict";
Array.prototype.last = function () {
    return this.last();
};
class Matrix {
    constructor(rows, columns, inputMatrix) {
        if (rows != inputMatrix.length || columns != inputMatrix[0].length) {
        }
        else if (rows == 0 || columns == 0) {
        }
        this.rows = rows;
        this.columns = columns;
        this.array = inputMatrix.slice();
    }
    log() {
        console.table(this.array);
    }
    rowSwap(targetRow, actorRow) {
        let swapped = this.array.map(row => row.slice());
        swapped[targetRow] = this.array[actorRow].slice();
        swapped[actorRow] = this.array[targetRow].slice();
        return new Matrix(this.rows, this.columns, swapped);
    }
    rowMultiplication(targetRow, scalar) {
        let multiplied = this.array.map(row => row.slice());
        multiplied[targetRow] = this.array[targetRow].map(entry => entry * scalar);
        return new Matrix(this.rows, this.columns, multiplied);
    }
    rowReplacement(targetRow, actorRow, scalar) {
        let result = this.array.map(row => row.slice());
        result[targetRow] = this.array[targetRow].map((entry, col) => entry + (scalar * this.array[actorRow][col]));
        return new Matrix(this.rows, this.columns, result);
    }
    getColumn(column) {
        return this.array.map(row => row[column]);
    }
    getRow(row) {
        return this.array[row];
    }
    ref() {
        let steps = [];
        steps.push(this);
        let currentCol = 0;
        for (let currentRow = 0; currentRow < this.rows; currentRow++) {
            let column = steps[steps.length - 1].getColumn(currentCol);
            while (isZero(column)) {
                if (++currentCol >= this.columns) {
                    return steps;
                }
                column = steps[steps.length - 1].getColumn(currentCol);
            }
            let max = indexOfMaxAbs(column.slice(currentRow)) + currentRow;
            console.log(`swapping row ${currentRow} with row ${max}, on column ${currentCol}`);
            steps.push(steps[steps.length - 1].rowSwap(max, currentRow));
            if (++currentCol >= this.columns) {
                return steps;
            }
        }
        return steps;
    }
}
function indexOfMaxAbs(array) {
    if (array.length == 0) {
        return -1;
    }
    let max = 0;
    let maxIndex = 0;
    for (let i = 0; i < array.length; i++) {
        if (Math.abs(array[i]) > max) {
            max = array[i];
            maxIndex = i;
        }
    }
    return maxIndex;
}
function isZero(array) {
    if (array.length == 0) {
    }
    for (let i = 0; i < array.length; i++) {
        if (array[i] != 0) {
            return false;
        }
    }
    return true;
}
function table(array) {
    for (let i = 0; i < array.length; i++) {
        console.table(array[i].array);
    }
}
let B = [
    [0, 2, 3],
    [0, 5, 1],
    [0, 8, 7]
];
let matrixB = new Matrix(3, 3, B);
let steps = matrixB.ref();
table(steps);
