'use strict';

class Matrix {

   /**
    * Constructs an empty matrix with the specified number of rows and columns. 
    * 
    * @param {number} rows The number of rows the matrix has.
    * @param {number} columns The number of columns the matrix has.
    */
   constructor(rows, columns) {
      this.rows = rows;
      this.columns = columns;
      this.matrixA;

      for (let i = 0; i < rows; i++) {
         matrixA[i] = [];
         for (let j = 0; j < columns; j++) {
            this.matrix[i][j] = undefined;
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
   updateEntry(value, row, column) {
      this.matrixA[row - 1][column - 1] = value;
   }

   rowSwitch(targetRow, actorRow) { }
   rowMultiplication(targetRow, scalar) { }
   rowAddition(targetRow, scalar, actorRow) { }

   matrixAddition(matrixB, subtraction) { }
   matrixMultiplication(matrixB) { }
   matrixEquality(matrixB) { }
   
   transpose();
   inverse();
   determinate();
}