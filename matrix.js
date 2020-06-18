'use strict';

class Matrix {

   // --------------------------------------------------------------------
   // Instance Methods
   // --------------------------------------------------------------------
   /**
    * Constructs an empty matrix with the specified number of rows and columns. 
    * 
    * @param {number} rows The number of rows the matrix has.
    * @param {number} columns The number of columns the matrix has.
    */
   constructor(rows, columns, inputMatrix) {
      this.rows = rows;
      this.columns = columns;
      this.array = [];

      if (inputMatrix !== undefined) {
         this.array = inputMatrix;
      } else {
         for (let i = 0; i < rows; i++) {
            this.array[i] = [];
            for (let j = 0; j < columns; j++) {
               this.array[i][j] = undefined;
            }
         }
      }
   }

   /**
    * Updates the corresponding entry with the passed value. If the value is a string, 
    * it will be treated as a variable. 
    * 
    * @param {number|string} value The value of the entry.
    * @param {number} row The row of the entry.
    * @param {number} column THe column of the entry.
    */
   updateEntry(row, column, value) {
      this.array[row - 1][column - 1] = value;
   }

   /**
    * Outputs the matrix as a table to the console.
    */
   log() {
      console.table(this.array);
   }

   // --------------------------------------------------------------------
   // Row Operations
   // --------------------------------------------------------------------
   /**
    * Swaps the specified rows of a matrix. 
    * 
    * @param {number} targetRow A row to swap.
    * @param {number} actorRow A row to swap.
    * @return {Matrix} The matrix with it's rows swapped.
    */
   rowSwap(targetRow, actorRow) {

      // matrices count from 1, arrays count from 0
      targetRow -= 1;
      actorRow -= 1;

      // return a new matrix with the rows swapped.
      let swapped = this.array.map(row => row.slice());
      swapped[targetRow] = this.array[actorRow].slice();
      swapped[actorRow] = this.array[targetRow].slice();
      return new Matrix(this.rows, this.columns, swapped);
   }

   /**
    * Multiplies a matrix row by a scalar.
    * 
    * @param {number} targetRow The row to multiply.
    * @param {number} scalar The value to multiply the row by. 
    * @return {Matrix} Matrix with the row multiplied.
    */
   rowMultiplication(targetRow, scalar) {

      // matrices count from 1, arrays count from 0
      targetRow -= 1;

      // return a new matrix with the specified row multiplied.
      let multiplied = this.array.map(row => row.slice());
      multiplied[targetRow] = this.array[targetRow].map(entry => entry * scalar);
      return new Matrix(this.rows, this.columns, multiplied);
   }

   /**
    * Adds a scalar multiple of a specified row to another. 
    * 
    * @param {number} targetRow The row to change. 
    * @param {number} actorRow The row to do the changing.
    * @param {number} scalar The multiple of the actor row.
    * @return {Matrix} The resulting matrix. 
    */
   rowAddition(targetRow, actorRow, scalar) {

      // matrices count from 1, arrays count from 0
      targetRow -= 1;
      actorRow -= 1;

      // return the resulting matrix from the row addition. 
      let result = this.array.map(row => row.slice());
      result[targetRow] = this.array[targetRow].map((entry, col) => entry + (scalar * this.array[actorRow][col]));
      return new Matrix(this.rows, this.columns, result);
   }

   matrixAddition(matrixB, subtraction) { }
   matrixMultiplication(matrixB) { }
   matrixEquality(matrixB) { }

   transpose() { }
   determinate() { }
   inverse() { }
}

// testing

// let m = [
//    [1, 2, 3],
//    [4, 5, 6],
//    [7, 8, 9]
// ];

// let matrix = new Matrix(3, 3, m);
// matrix.log();
// let x = matrix.rowAddition(1,2,-1);
// x.log();
// matrix.log();