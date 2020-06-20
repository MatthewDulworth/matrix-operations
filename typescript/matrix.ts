class Matrix {

   // --------------------------------------------------------------------
   // Properties
   // --------------------------------------------------------------------
   readonly rows: number;
   readonly columns: number;
   readonly array: ReadonlyArray<ReadonlyArray<number>>;



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

      // error handling
      if (rows != inputMatrix.length || columns != inputMatrix[0].length) {

      } else if (rows == 0 || columns == 0) {

      }

      this.rows = rows;
      this.columns = columns;
      this.array = inputMatrix.slice();
   }

   /**
    * Outputs the matrix as a table to the console.
    */
   public log() {
      console.table(this.array);
   }

   /**
    * Returns the specified column of the matrix as an array. 
    * 
    * @param {number} column the column 
    */
   public getColumn(column: number): readonly number[] {
      return this.array.map(row => row[column]);
   }

   /**
    * Returns the specified row of the matrix as an array.
    * 
    * @param {number} row the row
    */
   public getRow(row: number): readonly number[] {
      return this.array[row];
   }

   public at(row: number, column: number) {
      return this.array[row][column];
   }

   // --------------------------------------------------------------------
   // Row Operations
   // --------------------------------------------------------------------
   /**
    * Swaps the specified rows of a matrix. 
    * 
    * @param {number} targetRow A row to swap.
    * @param {number} actorRow A row to swap.
    * @returns {Matrix} The matrix with it's rows swapped.
    */
   public rowSwap(targetRow: number, actorRow: number): Matrix {
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
    * @returns {Matrix} Matrix with the row multiplied.
    */
   public rowMultiplication(targetRow: number, scalar: number): Matrix {
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
    * @returns {Matrix} The resulting matrix. 
    */
   public rowReplacement(targetRow: number, actorRow: number, scalar: number): Matrix {
      // return the resulting matrix from the row addition. 
      let result = this.array.map(row => row.slice());
      result[targetRow] = this.array[targetRow].map((entry, col) => entry + (scalar * this.array[actorRow][col]));
      return new Matrix(this.rows, this.columns, result);
   }



   // --------------------------------------------------------------------
   // Row Reduction
   // --------------------------------------------------------------------

   /**
    * Returns a list of the steps to reduce the current matrix to row echelon form. 
    * 
    * @returns {StepList} 
    */
   public ref() {
      let steps = new StepList(this);

      let currentCol = 0;
      for (let currentRow = 0; currentRow < this.rows; currentRow++) {

         // check if the current column is a zero vector,
         let column = steps.last().getColumn(currentCol);
         while (column[currentRow] == 0) {
            if (++currentCol >= this.columns) {
               return steps;
            }
            column = steps.last().getColumn(currentCol);
         }
         // partial pivot: swap largest below to current row
         let max = indexOfMaxAbs(column.slice(currentRow)) + currentRow;
         let swapResult = steps.last().rowSwap(max, currentRow);
         let swapInstruct = `swapping row ${currentRow} with row ${max}`;
         steps.addStep(swapResult, swapInstruct);

         // make current row one
         let scalar = 1 / steps.last().at(currentRow, currentCol);
         let multiplyResult = steps.last().rowMultiplication(currentRow, scalar);
         let multiplyInstruct = `multiplying row ${currentRow} by ${scalar}`;
         steps.addStep(multiplyResult, multiplyInstruct);

         // make zeroes below.
         for (let i = currentRow + 1; i < this.rows; i++) {
            let entry = steps.last().at(i, currentCol)
            if (entry != 0) {
               let replaceResult = steps.last().rowReplacement(i, currentRow, -entry);
               let replaceInstruct = `Add ${-entry} times row ${currentRow} to row ${i}`;
               steps.addStep(replaceResult, replaceInstruct);
            }
         }

         // increase the current column index
         if (++currentCol >= this.columns) {
            return steps;
         }
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

/**
 * @param array The array to check.
 * @returns The index of the entry with the largest maximum absolute value. 
 */
function indexOfMaxAbs(array: readonly number[]) {
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

// testing
// let A = [
//    [1, 2, 3],
//    [4, 5, 6],
//    [7, 8, 9]
// ];
// let matrixA = new Matrix(3, 3, A);
// let steps = matrixA.ref();
// steps.log();

let B = [
   [3, -6, -3],
   [2, -4, 1],
   [1, -2, 2]
]
let matrixB = new Matrix(3, 3, B);
let steps = matrixB.ref();
steps.log();

// let C = [
//    [0, 0, 2, 0],
//    [0, 0, 3, 9],
//    [2, 2, 7, 0],
//    [0, 0, 5, 9]
// ]
// let matrixC = new Matrix(3, 3, C);
// let steps = matrixC.rref();