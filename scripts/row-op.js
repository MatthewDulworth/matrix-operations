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
      this.matrices = [new Matrix(matrixArray.length, matrixArray[0].length, matrixArray)];

      this.rowLists = document.querySelectorAll(".row-list");
      this.display = document.getElementById("display");

      this.multiplyBtn = document.querySelector("#row-multiply button");
      this.addBtn = document.querySelector("#row-replace button");
      this.swapBtn = document.querySelector("#row-swap button");
      this.reduceBtn = document.querySelector("#row-reduce button");

      this.multiplyBtn.addEventListener('click', () => this.multiply());
      this.addBtn.addEventListener('click', () => this.add());
      this.swapBtn.addEventListener('click', () => this.swap());
      this.reduceBtn.addEventListener('click', () => this.reduce());

      this.display.firstElementChild.appendChild(this.createDisplayMatrix(this.lastResult(), "input"));
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
   createDisplayMatrix(matrix, name) {

      let displayMatrix = document.createElement('div');
      displayMatrix.classList.add(name);
      displayMatrix.classList.add("display-matrix");
      displayMatrix.innerHTML = "";

      let array = matrix.toString();
      for (let row = 0; row < matrix.rows; row++) {
         for (let col = 0; col < matrix.columns; col++) {
            let entry = document.createElement('div');
            entry.textContent = array[row][col];
            displayMatrix.appendChild(entry);
         }
      }

      displayMatrix.style.setProperty('grid-template-rows', `repeat(${matrix.rows}, auto)`);
      displayMatrix.style.setProperty('grid-template-columns', `repeat(${matrix.columns}, auto)`);

      return displayMatrix;
   }

   displayOperation(input, result) {
      let matrixPair = document.createElement("div");
      matrixPair.classList.add("matrix-pair");

      let inputDisplay = this.createDisplayMatrix(input, "input");
      let resultDisplay = this.createDisplayMatrix(result, "result");

      matrixPair.appendChild(inputDisplay);
      matrixPair.appendChild(resultDisplay);
      this.display.appendChild(matrixPair);
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
         result = this.lastResult().rowMultiplication(row, scalar);
      } catch (error) {
         alert("Invalid Input");
      }

      if (result !== undefined) {
         this.displayOperation(this.lastResult(), result);
         this.matrices.push(result);
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
         result = this.lastResult().rowReplacement(targetRow, actorRow, scalar);
      } catch (error) {
         alert("Invalid Input");
      }

      if (result !== undefined) {
         this.displayOperation(this.lastResult(), result);
         this.matrices.push(result);
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
         result = this.lastResult().rowSwap(targetRow, actorRow);
      } catch (error) {
         alert("Invalid Input");
      }

      if (result !== undefined) {
         this.displayOperation(this.lastResult(), result);
         this.matrices.push(result);
      }
   }

   /**
    * Row reduces matrix and displays the result.
    */
   reduce() {
      let result;

      try {
         result = this.lastResult().rref().last();
      } catch (error) {
         alert("Invalid Input");
      }

      if (result !== undefined) {
         this.displayOperation(this.lastResult(), result);
         this.matrices.push(result);
      }
   }


   // ---------------------------------------------------------------------------
   // Getters
   // ---------------------------------------------------------------------------
   lastResult() {
      return this.matrices[this.matrices.length - 1];
   }
}

const rowOpCalculator = new RowOperationsCalculator("_0");