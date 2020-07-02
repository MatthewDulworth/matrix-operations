"use strict";
class Matrix {
   /**
    * 
    * @param {*} rows 
    * @param {*} columns 
    * @param {*} inputMatrix 
    */
   constructor(rows, columns, inputMatrix) {
      if (rows != inputMatrix.length || columns != inputMatrix[0].length) {
      }
      else if (rows == 0 || columns == 0) {
      }
      this.rows = rows;
      this.columns = columns;
      this.array = this.toFraction(inputMatrix);
   }

   /**
    * 
    * @param {*} array 
    */
   toFraction(array) {
      let fracArray = [];
      for (let i = 0; i < array.length; i++) {
         fracArray[i] = [];
         for (let j = 0; j < array[0].length; j++) {
            fracArray[i][j] = new Fraction(array[i][j]);
         }
      }
      return fracArray;
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
   // row operations
   rowSwap(targetRow, actorRow) {
      let swapped = this.array.map(row => row.slice());
      swapped[targetRow] = this.array[actorRow].slice();
      swapped[actorRow] = this.array[targetRow].slice();
      return new Matrix(this.rows, this.columns, swapped);
   }
   rowMultiplication(targetRow, scalar) {
      let multiplied = this.array.map(row => row.slice());
      multiplied[targetRow] = this.array[targetRow].map(entry => entry.mul(scalar).simplify());
      return new Matrix(this.rows, this.columns, multiplied);
   }
   rowReplacement(targetRow, actorRow, scalar) {
      let result = this.array.map(row => row.slice());
      result[targetRow] = this.array[targetRow].map((entry, col) => entry.add(this.array[actorRow][col].mul(scalar)).simplify());
      return new Matrix(this.rows, this.columns, result);
   }
   // row reduction
   ref() {
      let steps = new StepList(this);
      let currentCol = 0;
      for (let currentRow = 0; currentRow < this.rows; currentRow++) {
         let column = steps.last().getColumn(currentCol);
         while (column[currentRow].equals(0)) {
            if (++currentCol >= this.columns) {
               return steps;
            }
            column = steps.last().getColumn(currentCol);
         }
         let max = indexOfMaxAbs(column.slice(currentRow)) + currentRow;
         let swapResult = steps.last().rowSwap(max, currentRow);
         let swapInstruct = `swapping row ${currentRow} with row ${max}`;
         steps.addStep(swapResult, swapInstruct);
         let scalar = steps.last().at(currentRow, currentCol).inverse();
         let multiplyResult = steps.last().rowMultiplication(currentRow, scalar);
         let multiplyInstruct = `multiplying row ${currentRow} by ${scalar.toString()}`;
         steps.addStep(multiplyResult, multiplyInstruct);
         for (let i = currentRow + 1; i < this.rows; i++) {
            let entry = steps.last().at(i, currentCol);
            if (!entry.equals(0)) {
               let replaceResult = steps.last().rowReplacement(i, currentRow, entry.neg());
               let replaceInstruct = `Add ${entry.neg().toString()} times row ${currentRow} to row ${i}`;
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
      if (array[i].abs().compare(max) < 0) {
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
// let steps = matrixB.ref();
// steps.log();
