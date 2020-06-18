'use strict';

class Matrix {

   /**
    * Constructs an empty matrix with the specified number of rows and columns. 
    * 
    * @param {number} rows The number of rows the matrix has.
    * @param {number} columns The number of columns the matrix has.
    */
   constructor(rows, columns, inputMatrix) {
      this.rows = rows;
      this.columns = columns;
      this.matrix = [];

      if (inputMatrix !== undefined) {
         this.matrix = inputMatrix;
      } else {
         for (let i = 0; i < rows; i++) {
            this.matrix[i] = [];
            for (let j = 0; j < columns; j++) {
               this.matrix[i][j] = undefined;
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
      this.matrix[row - 1][column - 1] = value;
   }

   /**
    * Outputs the matrix as a table to the console.
    */
   log() {
      console.table(this.matrix);
   }

   /**
    * Swaps the specified rows of the matrix. 
    * 
    * @param {number} targetRow A row to swap.
    * @param {number} actorRow A row to swap.
    */
   rowSwap(targetRow, actorRow) {
      targetRow -= 1;
      actorRow -= 1;

      let tempRow = this.matrix[targetRow];
      this.matrix[targetRow] = this.matrix[actorRow];
      this.matrix[actorRow] = tempRow;
   }

   /**
    * Multiplies the specified row by the scalar.
    * 
    * @param {number} targetRow The row to multiply.
    * @param {number} scalar The value to multiply the row by. 
    */
   rowMultiplication(targetRow, scalar) { 
      targetRow -= 1;
      this.matrix[targetRow] = this.matrix[targetRow].map(entry => entry * scalar);
   }

   /**
    * Adds the scalar multiply of the actor row to the target row.
    * 
    * @param {number} targetRow The row to change. 
    * @param {number} actorRow The row to do the changing.
    * @param {number} scalar The multiple of the actor row.
    */
   rowAddition(targetRow, actorRow, scalar) { 
      targetRow -=1;
      actorRow -=1;
      this.matrix[targetRow] = this.matrix[targetRow].map((entry, col) => entry - (scalar * this.matrix[actorRow][col]));
   }

   matrixAddition(matrixB, subtraction) { }
   matrixMultiplication(matrixB) { }
   matrixEquality(matrixB) { }

   transpose() { }
   determinate() { }
   inverse() { }
}

class IllegalArgumentException extends Error {
   constructor(message) {
      super(message);
      this.name = this.constructor.name;
   }
}