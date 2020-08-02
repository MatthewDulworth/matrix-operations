'use strict';

/**
 * Holds the behavior and UI of a row operations calculator.
 * Depends on the Matrix class for matrix calculations.
 * 
 * Allows the user to do row operations or row reduction on a matrix.
 */
class RowOperationsCalculator {
   /**
    * @param {string} matrixID Where the initial matrix array is stored in session storage.
    */
   constructor(matrixID) {
      let matrixArray = JSON.parse(sessionStorage.getItem(matrixID));
      this.inputMatrix = new Matrix(matrixArray.length, matrixArray[0].length, matrixArray);
      console.log(this.inputMatrix.toString());
      this.resultMatrix;

      this.rowLists = document.querySelectorAll(".row-list");
      this.initialDisplayMatrix = document.querySelector(".input");
      this.finalDisplayMatrix = document.querySelector(".result");

      this.multiplyBtn = document.querySelector("#row-multiply button");
      this.addBtn = document.querySelector("#row-replace button");
      this.swapBtn = document.querySelector("#row-swap button");

      this.multiplyBtn.addEventListener('click', () => this.multiply());
      this.addBtn.addEventListener('click', () => this.add());
      this.swapBtn.addEventListener('click', () => this.swap());

      this.displayMatrix(matrixArray, this.initialDisplayMatrix);
      this.initRowLists(this.rowLists, matrixArray.length);
   }


   // ---------------------------------------------------------------------------
   // Initialize Row Lists
   // ---------------------------------------------------------------------------
   /**
    * Generates the lists of rows to be used in selecting a row.
    * @param {NodeList} rowLists The select elements.
    * @param {number} rows The number of rows in the matrix.
    */
   initRowLists(rowLists, rows) {
      let options = "";
      for (let row = 1; row <= rows; row++) {
         options += `<option value=${row}>${row}</option>`;
      }
      rowLists.forEach(list => list.innerHTML = options);
   }


   // ---------------------------------------------------------------------------
   // Display Matrix
   // ---------------------------------------------------------------------------
   /**
    * Displays the passed matrixArray on the page. 
    * @param {string[][]} matrixArray The matrix to display.
    * @param {HTMLElement} matrixWrapper The element to house the matrix.
    */
   displayMatrix(matrixArray, matrixWrapper) {
      let rows = matrixArray.length;
      let columns = matrixArray[0].length;
      matrixWrapper.innerHTML = "";

      for (let row = 0; row < rows; row++) {
         for (let col = 0; col < columns; col++) {
            let entry = document.createElement('div');
            entry.textContent = matrixArray[row][col];
            matrixWrapper.appendChild(entry);
         }
      }

      matrixWrapper.style.setProperty('display', 'grid');
      matrixWrapper.style.setProperty('grid-template-rows', `repeat(${rows}, auto)`);
      matrixWrapper.style.setProperty('grid-template-columns', `repeat(${columns}, auto)`);
   }


   // ---------------------------------------------------------------------------
   // Operations
   // ---------------------------------------------------------------------------
   /**
    * Multiplies a row by a scalar and displays the output.
    */
   multiply() {
      let row = parseInt(document.querySelector("#row-multiply select").value) - 1;
      let scalar = document.querySelector("#row-multiply input").value;
      let result;

      try {
         result = this.inputMatrix.rowMultiplication(row, scalar);
      } catch (error) {
         alert("Invalid Input");
      }

      if (result !== undefined) {
         this.displayMatrix(result.array, this.finalDisplayMatrix);
      }
   }

   /**
    * Adds a scalar times a row to another row and displays the result.
    */
   add() {
      let scalar = document.querySelector("#row-replace input").value;
      let actorRow = parseInt(document.querySelector("#row-replace select:nth-of-type(1)").value) - 1;
      let targetRow = parseInt(document.querySelector("#row-replace select:nth-of-type(2)").value) - 1;
      let result;

      try {
         result = this.inputMatrix.rowReplacement(targetRow, actorRow, scalar);
      } catch (error) {
         alert("Invalid Input");
      }

      if (result !== undefined) {
         this.displayMatrix(result.array, this.finalDisplayMatrix);
      }
   }

   /**
    * Swaps two rows and displays the result.
    */
   swap() {
      let actorRow = parseInt(document.querySelector("#row-swap select:nth-of-type(1)").value) - 1;
      let targetRow = parseInt(document.querySelector("#row-swap select:nth-of-type(2)").value) - 1;
      let result;

      try {
         result = this.inputMatrix.rowSwap(targetRow, actorRow);
      } catch (error) {
         alert("Invalid Input");
      }

      if (result !== undefined) {
         this.displayMatrix(result.array, this.finalDisplayMatrix);
      }
   }
}

const rowOpCalculator = new RowOperationsCalculator("_0");