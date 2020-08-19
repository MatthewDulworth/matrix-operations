"use strict";

/**
 * A class to model a matrix and matrix operations. 
 */
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
      /** @type {Fraction[][]} */
      this.array = this.toFraction(inputMatrix);
      this.DEBUG = false;
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

   cloneArray() {
      let clone = [];
      for (let i = 0; i < this.rows; i++) {
         clone[i] = [];
         for (let j = 0; j < this.columns; j++) {
            clone[i][j] = this.at(i, j).clone();
         }
      }
      return clone;
   }


   // ---------------------------------------------------------------------------
   // Row Operations
   // ---------------------------------------------------------------------------

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
      multiplied[targetRow] = this.array[targetRow].map(entry => entry.mul(scalar));
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


   // ---------------------------------------------------------------------------
   // Row Reduction
   // ---------------------------------------------------------------------------

   /**
    * Returns the index of the entry in the array with the largest absolute value. 
    * @param {Fraction[]} fracArray 
    * @returns {number}
    */
   indexOfMaxAbs(fracArray) {
      if (fracArray.length == 0) {
         return -1;
      }
      let max = -1;
      let maxIndex = 0;
      for (let i = 0; i < fracArray.length; i++) {
         let value = fracArray[i].abs().valueOf();
         if (value > max) {
            max = value;
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
   swapToMax(steps, column, currentRow, currentCol) {
      let maxIndex = this.indexOfMaxAbs(column.slice(currentRow)) + currentRow;
      if (maxIndex !== currentRow) {
         let swapResult = steps.last().rowSwap(maxIndex, currentRow);
         let swapInstruct = `Swap row ${currentRow + 1} with row ${maxIndex + 1}.`;
         steps.addStep(swapResult, swapInstruct, currentRow, maxIndex);

         if (this.DEBUG === true) {
            console.log(`row: ${currentRow} col: ${currentCol}`);
            steps.logLast();
         }

      }
   }

   /**
    * Uses row operations to reduce the current entry to one. 
    * @param {StepList} steps The stepList being operated on. 
    * @param {*} currentRow 
    * @param {*} currentCol 
    */
   reduceToOne(steps, currentRow, currentCol) {
      if (!steps.last().at(currentRow, currentCol).equals(1)) {
         let scalar = steps.last().at(currentRow, currentCol).inverse();
         let multiplyResult = steps.last().rowMultiplication(currentRow, scalar);
         let multiplyInstruct = `Multiply row ${currentRow + 1} by ${scalar.toFraction()}.`;
         steps.addStep(multiplyResult, multiplyInstruct, currentRow, currentRow);

         if (this.DEBUG === true) {
            console.log(`row: ${currentRow} col: ${currentCol}`);
            steps.logLast();
         }
      }
   }

   /**
    * Uses row operations to make the current entry zero.
    * @param {StepList} steps The steplist being operated on. 
    * @param {number} pivotRow 
    * @param {number} pivotCol
    * @param {number} rowIndex The row being operated on. 
    */
   makeZero(steps, pivotRow, pivotCol, rowIndex) {
      let entry = steps.last().at(rowIndex, pivotCol);
      if (!entry.equals(0)) {
         let replaceResult = steps.last().rowReplacement(rowIndex, pivotRow, entry.neg());
         let replaceInstruct = `Add ${entry.neg().toFraction()} times row ${pivotRow + 1} to row ${rowIndex + 1}.`;
         steps.addStep(replaceResult, replaceInstruct, rowIndex, pivotRow);

         if (this.DEBUG === true) {
            console.log(`row: ${pivotRow} col: ${pivotCol}`);
            steps.logLast();
         }
      }
   }

   /**
    * Uses row operations to make all entries in the current column below the current row zero.
    * @param {StepList} steps The steplist being operated on. 
    * @param {number} pivotRow 
    * @param {number} pivotCol 
    */
   makeZeroBelow(steps, pivotRow, pivotCol) {
      for (let i = pivotRow + 1; i < this.rows; i++) {
         this.makeZero(steps, pivotRow, pivotCol, i);
      }
   }

   /**
    * Uses row operations to make all entries in the current column above the current row zero.
    * @param {StepList} steps The steplist being operated on. 
    * @param {number} pivotRow 
    * @param {number} pivotCol 
    */
   makeZeroAbove(steps, pivotRow, pivotCol) {
      for (let i = pivotRow - 1; i >= 0; i--) {
         this.makeZero(steps, pivotRow, pivotCol, i);
      }
   }

   /**
    * Finds the pivot columns in an echelon form matrix.
    * @param {Matrix} echelonMatrix
    * @returns {Object[]}
    */
   findPivotColsInRef(echelonMatrix) {
      let pivotLocations = [];
      let minCol = 0;

      for (let row = 0; row < this.rows; row++) {
         for (let col = minCol; col < this.columns; col++) {
            if (!echelonMatrix.at(row, col).equals(0)) {
               pivotLocations.push({ 'row': row, 'col': col });
               minCol++;
               break;
            }
         }
      }
      return pivotLocations;
   }

   /**
    * Returns a list containing all the steps to reduce the matrix to row echelon form.
    * @returns {StepList}
    */
   ref() {
      let steps = new StepList(this);
      let currentCol = 0;

      if (this.DEBUG === true) {
         steps.logLast();
      }

      // Loop through each row. 
      for (let currentRow = 0; currentRow < this.rows; currentRow++) {

         // Find the next non-zero column
         let column = steps.last().getColumn(currentCol);
         this.swapToMax(steps, column, currentRow, currentCol);
         column = steps.last().getColumn(currentCol);

         while (steps.last().at(currentRow, currentCol).equals(0)) {
            currentCol++;
            if (currentCol >= this.columns) {
               return steps;
            }
            column = steps.last().getColumn(currentCol);
            this.swapToMax(steps, column, currentRow, currentCol);
         }

         this.reduceToOne(steps, currentRow, currentCol);
         this.makeZeroBelow(steps, currentRow, currentCol);

         // Check if we have checked all columns. 
         if (++currentCol >= this.columns) {
            return steps;
         }
      }
      return steps;
   }

   /**
    * Returns a list containing all the steps to reduce the matrix to row reduced echelon form.
    */
   rref() {
      let steps = this.ref();
      let pivotLocs = this.findPivotColsInRef(steps.last());

      for (let j = 0; j < pivotLocs.length; j++) {
         this.makeZeroAbove(steps, pivotLocs[j].row, pivotLocs[j].col);
      }
      return steps;
   }


   // ---------------------------------------------------------------------------
   // Matrix Operations
   // ---------------------------------------------------------------------------

   /**
    * Multiplies the matrix by the passed matrix. 
    * @param {Matrix} otherMatrix The matrix to multiply by. 
    * @returns {Matrix} A matrix representing the product of the operation. 
    */
   matrixMultiplication(otherMatrix) {
      if (this.rows != otherMatrix.columns) {
         throw Error(`The rows of the first matrix must match the columns of the second matrix. Found rows: ${this.rows}, columns: ${otherMatrix.columns}`);
      }

      const product = [];
      for (let leftRow = 0; leftRow < this.rows; leftRow++) {
         product[leftRow] = [];

         for (let rightCol = 0; rightCol < otherMatrix.columns; rightCol++) {
            product[leftRow][rightCol] = new Fraction(0);

            for (let term = 0; term < this.columns; term++) {
               let smallProduct = this.at(leftRow, term).mul(otherMatrix.at(term, rightCol));
               product[leftRow][rightCol] = product[leftRow][rightCol].add(smallProduct);
            }
         }
      }

      return new Matrix(this.rows, otherMatrix.columns, product);
   }

   /**
    * Multiplies the matrix by the passed scalar.
    * @param {number} scalar 
    * @returns {Matrix} A matrix representing the product of the operation. 
    */
   scalarMultiplication(scalar) {
      let product = this.array.map(row => row.map(entry => entry.mul(scalar)));
      return new Matrix(this.rows, this.columns, product);
   }

   /**
    * @returns {Matrix} The transpose of the matrix.
    */
   transpose() {
      let transpose = [];
      for (let j = 0; j < this.columns; j++) {
         transpose[j] = [];
         for (let i = 0; i < this.rows; i++) {
            transpose[j][i] = this.array[i][j];
         }
      }
      return new Matrix(this.columns, this.rows, transpose);
   }

   /**
    * @param {Matrix} otherMatrix 
    * @param {boolean} addition
    * @returns {Matrix} 
    */
   matrixAddition(otherMatrix, addition = true) {

      if (this.rows !== otherMatrix.rows || this.columns != otherMatrix.columns) {
         throw Error("Invalid Input, matrix rows and columns must match");
      }

      let sign = -1;
      if (addition) {
         sign = 1;
      }

      let resultArray = [];

      for (let row = 0; row < this.rows; row++) {
         resultArray[row] = [];
         for (let col = 0; col < this.columns; col++) {
            resultArray[row][col] = this.at(row, col).add(otherMatrix.at(row, col).mul(sign)).toFraction();
         }
      }

      return new Matrix(this.rows, this.columns, resultArray);
   }

   /**
    * @param {Matrix} otherMatrix 
    * @returns {boolean}
    */
   equals(otherMatrix) {
      if (otherMatrix.rows !== this.rows || otherMatrix.columns !== this.columns) {
         return false;
      } else {
         for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
               if (!this.at(row, col).equals(otherMatrix.at(row, col))) {
                  return false;
               }
            }
         }
         return true;
      }
   }

   // ---------------------------------------------------------------------------
   // Matrix Inverse 
   // ---------------------------------------------------------------------------

   /**
    * @returns {StepList} The steps to achieve the inverse of the matrix if possible. 
    */
   inverse() {
      if (this.rows === this.columns) {
         const stepList = this.augmentedIdentityMatrix().rref();
         stepList.instructions[0] = "Create augmented matrix with identity matrix.";

         if (stepList.last().isAugmentedIdentity()) {
            const inverseArray = stepList.last().cloneArray().map(row => row.splice(this.rows));
            const inverse = new Matrix(this.rows, this.columns, inverseArray);
            stepList.addStep(inverse, "The inverse.");
         } else {
            stepList.addStep(this, "This matrix is not invertible because it is not row equivalent to the identity matrix.");
         }
         return stepList;

      } else {
         const stepList = new StepList(this);
         stepList.instructions[0] = "Matrix is not invertible because it is not square.";
         return stepList;
      }
   }

   /**
    * Checks if the initial sub matrix of this augmented matrix is an identity matrix.
    * @returns {boolean} 
    */
   isAugmentedIdentity() {
      if (this.rows * 2 === this.columns) {
         for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.rows; j++) {

               if (i === j && !this.at(i, j).equals(1)) {
                  return false;
               } else if (i !== j && !this.at(i, j).equals(0)) {
                  return false;
               }

            }
         }
         return true;
      } else {
         return false;
      }
   }

   /**
    * @throws This must be a square matrix.
    * @returns {Matrix} This matrix augmented with the identity matrix.
    */
   augmentedIdentityMatrix() {
      if (this.rows === this.columns) {
         const augmentedArray = [];

         for (let i = 0; i < this.rows; i++) {
            augmentedArray[i] = [];
            for (let j = 0; j < this.columns * 2; j++) {

               let value = 0;
               if (j < this.columns) {
                  value = this.at(i, j);
               } else if (i + this.rows === j) {
                  value = 1;
               }
               augmentedArray[i][j] = value;
            }
         }
         return new Matrix(this.rows, this.columns * 2, augmentedArray);
      } else {
         throw Error("This must be a square matrix");
      }
   }
}

// const A = [
//    [1, 2, 3],
//    [4, 5, 6]
// ];
// const matrixA = new Matrix(2, 3, A);

// const B = [
//    [7, 8],
//    [9, 10],
//    [11, 12]
// ];
// const matrixB = new Matrix(3, 2, B);

// matrixB.matrixMultiplication(matrixA).log();