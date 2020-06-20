"use strict";
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
    getColumn(column) {
        return this.array.map(row => row[column]);
    }
    getRow(row) {
        return this.array[row];
    }
    at(row, column) {
        return this.array[row][column];
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
    ref() {
        let steps = new StepList(this);
        let currentCol = 0;
        for (let currentRow = 0; currentRow < this.rows; currentRow++) {
            let column = steps.last().getColumn(currentCol);
            while (column[currentRow] == 0) {
                if (++currentCol >= this.columns) {
                    return steps;
                }
                column = steps.last().getColumn(currentCol);
            }
            let max = indexOfMaxAbs(column.slice(currentRow)) + currentRow;
            let swapResult = steps.last().rowSwap(max, currentRow);
            let swapInstruct = `swapping row ${currentRow} with row ${max}`;
            steps.addStep(swapResult, swapInstruct);
            let scalar = 1 / steps.last().at(currentRow, currentCol);
            let multiplyResult = steps.last().rowMultiplication(currentRow, scalar);
            let multiplyInstruct = `multiplying row ${currentRow} by ${scalar}`;
            steps.addStep(multiplyResult, multiplyInstruct);
            for (let i = currentRow + 1; i < this.rows; i++) {
                let entry = steps.last().at(i, currentCol);
                if (entry != 0) {
                    let replaceResult = steps.last().rowReplacement(i, currentRow, -entry);
                    let replaceInstruct = `Add ${-entry} times row ${currentRow} to row ${i}`;
                    steps.addStep(replaceResult, replaceInstruct);
                }
            }
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
let B = [
    [3, -6, -3],
    [2, -4, 1],
    [1, -2, 2]
];
let matrixB = new Matrix(3, 3, B);
let steps = matrixB.ref();
steps.log();
