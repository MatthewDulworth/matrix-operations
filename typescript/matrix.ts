interface Array<T> {
   last(): any;
}

Array.prototype.last = function (): any {
   return this.last();
}

class Matrix {

   // --------------------------------------------------------------------
   // Properties
   // --------------------------------------------------------------------
   readonly rows: number;
   readonly columns: number;
   readonly array: readonly number[][];



   // --------------------------------------------------------------------
   // Instance Methods
   // --------------------------------------------------------------------
   /**
    * Constructs a matrix from the passed 2d array.  
    * 
    * @param {number} rows The number of rows the matrix has.
    * @param {number} columns The number of columns the matrix has.
    */
   constructor(rows: number, columns: number, inputMatrix: number[][]) {

      if(rows != inputMatrix.length || columns != inputMatrix[0].length) {
         
      }

      this.rows = rows;
      this.columns = columns;
      this.array = inputMatrix.slice();
   }

   /**
    * Updates the corresponding entry with the passed value. 
    * 
    * @param {number} value The value of the entry.
    * @param {number} row The row of the entry.
    * @param {number} column THe column of the entry.
    */
   updateEntry(row: number, column: number, value: number) {
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
   rowSwap(targetRow: number, actorRow: number): Matrix {

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
   rowMultiplication(targetRow: number, scalar: number): Matrix {

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
   rowReplacement(targetRow: number, actorRow: number, scalar: number): Matrix {

      // matrices count from 1, arrays count from 0
      targetRow -= 1;
      actorRow -= 1;

      // return the resulting matrix from the row addition. 
      let result = this.array.map(row => row.slice());
      result[targetRow] = this.array[targetRow].map((entry, col) => entry + (scalar * this.array[actorRow][col]));
      return new Matrix(this.rows, this.columns, result);
   }



   // --------------------------------------------------------------------
   // Row Reduction
   // --------------------------------------------------------------------

   /**
    * Returns the specified column of the matrix as an array. 
    * 
    * @param {number} column the column 
    */
   getColumn(column: number): number[] {
      return this.array.map(row => row[column - 1]);
   }

   /**
    * Returns the specified row of the matrix as an array.
    * 
    * @param {number} row the row
    */
   getRow(row: number): number[] {
      return this.array[row - 1];
   }

   ref() {
      let steps = [];
      steps.push(this);

      //let column = 1;
      for (let row = 1; row <= this.rows; row++) {

         // swap to largest, if row,col is 0, j++
      }

      return steps;
   }

   // rref(showSteps) {}


   // --------------------------------------------------------------------
   // Matrix Operations
   // --------------------------------------------------------------------
   // sum(matrixB, subtraction) { }
   // product(matrixB) { }
   // equals(matrixB) { }

   // transpose() { }
   // determinate() { }
   // inverse() { }
}

// testing

// let A = [
//    [1, 2, 3],
//    [4, 5, 6],
//    [7, 8, 9]
// ];
// let matrixA = new Matrix(3, 3, A);

// let B = [
//    [9, 8, 7],
//    [6, 5, 4],
//    [3, 2, 1]
// ]
// let matrixB = new Matrix(3, 3, B);
// matrixB.log();

// let C = [
//    [0, 0, 2, 0],
//    [0, 0, 3, 9],
//    [2, 2, 7, 0],
//    [0, 0, 5, 9]
// ]
// let matrixC = new Matrix(3, 3, C);
// let steps = matrixC.rref();