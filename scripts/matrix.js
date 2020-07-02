"use strict";
class Matrix {
   /**
    * Constructs a multidimensional array of fractions to hold the entries of the matrix based on the input matrix.
    * 
    * @param {number} rows
    * @param {number} columns 
    * @param {Array} inputMatrix 
    */
   constructor(rows, columns, inputMatrix) {
      this.rows = rows;
      this.columns = columns;
      this.array = this.toFraction(inputMatrix);
   }

   /**
    * Takes in an array of numbers and turns it into an array of fractions.
    * @param {number[]}
    * @returns {Fraction[][]}
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

   /**
    * Displays the matrix on the console.
    */
   log() {
      console.table(this.toString());
   }

   /**
    * Returns a 2d string array representation of the matrix. 
    * @returns {string[][]}
    */
   toString() {
      let strArray = [];
      for (let i = 0; i < this.rows; i++) {
         strArray[i] = [];
         for (let j = 0; j < this.columns; j++) {
            strArray[i][j] = this.array[i][j].toFraction();
         }
      }
      return strArray;
   }

   /**
    * Returns the specified column of the matrix as an array of Fractions.
    * @param {number} column 
    * @returns {Fraction}
    */
   getColumn(column) {
      return this.array.map(row => row[column]);
   }

   /**
    * Returns the specified row of the matrix as an array of Fraction.
    * @param {number} row 
    * @return {Fraction[]}
    */
   getRow(row) {
      return this.array[row];
   }

   /**
    * Returns the entry in the matrix at the specified row and column.
    * @param {number} row 
    * @param {number} column 
    * @returns {Fraction}
    */
   at(row, column) {
      return this.array[row][column];
   }

   /**
    * Returns a new matrix with the target and actor rows swapped.
    * @param {number} targetRow 
    * @param {number} actorRow 
    * @returns {Matrix}
    */
   rowSwap(targetRow, actorRow) {
      let swapped = this.array.map(row => row.slice());
      swapped[targetRow] = this.array[actorRow].slice();
      swapped[actorRow] = this.array[targetRow].slice();
      return new Matrix(this.rows, this.columns, swapped);
   }

   /**
    * Returns a new matrix with the target row multiplied by the scalar. 
    * @param {number} targetRow 
    * @param {number} scalar 
    * @returns {Matrix}
    */
   rowMultiplication(targetRow, scalar) {
      let multiplied = this.array.map(row => row.slice());
      multiplied[targetRow] = this.array[targetRow].map(entry => entry.mul(scalar).simplify());
      return new Matrix(this.rows, this.columns, multiplied);
   }

   /**
    * Returns a new matrix created by adding the scalar multiplied by the actor row to the target row.
    * @param {number} targetRow 
    * @param {number} actorRow 
    * @param {number} scalar 
    * @returns {Matrix}
    */
   rowReplacement(targetRow, actorRow, scalar) {
      let result = this.array.map(row => row.slice());
      result[targetRow] = this.array[targetRow].map((entry, col) => entry.add(this.array[actorRow][col].mul(scalar)).simplify());
      return new Matrix(this.rows, this.columns, result);
   }

   /**
    * Returns the index of the entry in the array with the largest absolute value. 
    * @param {Fraction[]} fracArray 
    * @returns {number}
    */
   indexOfMaxAbs(fracArray) {
      if (fracArray.length == 0) {
         return -1;
      }
      let max = 0;
      let maxIndex = 0;
      for (let i = 0; i < fracArray.length; i++) {
         if (fracArray[i].abs().compare(max) < 0) {
            max = fracArray[i];
            maxIndex = i;
         }
      }
      return maxIndex;
   }

   /**
    * Uses row operations to swap make the current entry the largest of those below it. 
    * @param {StepList} steps 
    * @param {number} column 
    * @param {number} currentRow 
    */
   swapToMax(steps, column, currentRow) {
      let maxIndex = this.indexOfMaxAbs(column.slice(currentRow)) + currentRow;
      if (maxIndex !== currentRow) {
         let swapResult = steps.last().rowSwap(maxIndex, currentRow);
         let swapInstruct = `Swap row ${currentRow + 1} with row ${maxIndex + 1}`;
         steps.addStep(swapResult, swapInstruct);
      }
   }

   /**
    * Uses row operations to reduce the current entry to one. 
    * @param {StepList} steps The stepList being operated on. 
    * @param {*} currentRow 
    * @param {*} currentCol 
    */
   reduceToOne(steps, currentRow, currentCol) {
      if (!this.at(currentRow, currentCol).equals(1)) {
         let scalar = steps.last().at(currentRow, currentCol).inverse();
         let multiplyResult = steps.last().rowMultiplication(currentRow, scalar);
         let multiplyInstruct = `Multiply row ${currentRow + 1} by ${scalar.toFraction()}`;
         steps.addStep(multiplyResult, multiplyInstruct);
      }
   }

   /**
    * Uses row operations to make all entries in the current column below the current row zero.
    * @param {StepList} steps The steplist being operated on. 
    * @param {number} currentRow 
    * @param {number} currentCol 
    */
   makeBelowZero(steps, currentRow, currentCol) {
      for (let i = currentRow + 1; i < this.rows; i++) {
         let entry = steps.last().at(i, currentCol); 2
         if (!entry.equals(0)) {
            let replaceResult = steps.last().rowReplacement(i, currentRow, entry.neg());
            let replaceInstruct = `Add ${entry.neg().toFraction()} times row ${currentRow + 1} to row ${i + 1}`;
            steps.addStep(replaceResult, replaceInstruct);
         }
      }
   }

   /**
    * Returns a list containing all the steps to reduce the matrix to row echelon form.
    * @returns {StepList}
    */
   ref() {
      let steps = new StepList(this);
      let currentCol = 0;

      // Loop through each row. 
      for (let currentRow = 0; currentRow < this.rows; currentRow++) {

         // Find the next non-zero column
         let column = steps.last().getColumn(currentCol);
         while (column[currentRow].equals(0)) {
            if (++currentCol >= this.columns) {
               return steps;
            }
            column = steps.last().getColumn(currentCol);
         }

         this.swapToMax(steps, column, currentRow);
         this.reduceToOne(steps, currentRow, currentCol);
         this.makeBelowZero(steps, currentRow, currentCol);

         // Check if we have checked all columns. 
         if (++currentCol >= this.columns) {
            return steps;
         }
      }
      return steps;
   }
}

let B = [
   [3, -3, -2, -1],
   [0, 2, -3, -3],
   [3, 3, 2, -3]
];
let matrixB = new Matrix(3, 4, B);
let steps = matrixB.ref();
steps.log();