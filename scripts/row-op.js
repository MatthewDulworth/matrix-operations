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

      /*** @type {Matrix[]}*/
      this.matrices = [new Matrix(matrixArray.length, matrixArray[0].length, matrixArray)];
      this.first = true;

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
   // Operations
   // ---------------------------------------------------------------------------
   /**
    * Attempts to perform a row operation, if unsuccessful, alerts the user.
    * If successful, displays the result, scrolls the button that triggered 
    * the operation into view, and stores the result in this.matrices.
    * @param {Function} operation A callback to the operation to perform.
    * @param {Array<number|string>} params The operations parameters.
    * @param {HTMLElement} button The button that triggered the operation.
    */
   tryOperation(operation, params, button) {
      let result;

      try {
         result = operation(...params);
      } catch (error) {
         alert("Invalid Input");
      }

      if (result !== undefined) {
         this.displayOperation(this.lastResult(), result);
         this.matrices.push(result);
         button.scrollIntoView();
      }
   }

   /**
    * Multiplies a row by a scalar and displays the output.
    */
   multiply() {
      let targetRow = parseInt(document.querySelector("#row-multiply select").value) - 1;
      let scalar = document.querySelector("#row-multiply input").value;
      this.tryOperation(this.lastResult().rowMultiplication.bind(this.lastResult()), [targetRow, scalar], this.multiplyBtn);
   }

   /**
    * Adds a scalar times a row to another row and displays the result.
    */
   add() {
      let targetRow = parseInt(document.querySelector("#row-replace select:nth-of-type(2)").value) - 1;
      let actorRow = parseInt(document.querySelector("#row-replace select:nth-of-type(1)").value) - 1;
      let scalar = document.querySelector("#row-replace input").value;
      this.tryOperation(this.lastResult().rowReplacement.bind(this.lastResult()), [actorRow, targetRow, scalar], this.addBtn);
   }

   /**
    * Swaps two rows and displays the result.
    */
   swap() {
      let actorRow = parseInt(document.querySelector("#row-swap select:nth-of-type(1)").value) - 1;
      let targetRow = parseInt(document.querySelector("#row-swap select:nth-of-type(2)").value) - 1;
      this.tryOperation(this.lastResult().rowSwap.bind(this.lastResult()), [actorRow, targetRow], this.swapBtn);
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
         this.reduceBtn.scrollIntoView();
      }
   }


   // ---------------------------------------------------------------------------
   // Display Matrix
   // ---------------------------------------------------------------------------
   /**
    * Creates html to display the passed matrix.
    * @throws Invalid Input if name is not "input" or "result"
    * @param {Matrix} matrix The matrix to display.
    * @param {string} name The type of matrix it is, "input" or "result".
    * @returns {HTMLElement} The matrix display element.
    */
   createDisplayMatrix(matrix, name) {

      if (name != "input" && name != "result") {
         throw Error('Invalid Input, name must be "input" or "result"');
      }

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

   /**
    * Displays an operation on the page. 
    * @param {Matrix} input The input matrix.
    * @param {Matrix} result the resulting matrix.
    */
   displayOperation(input, result) {

      if (this.first) {
         this.display.firstElementChild.remove();
         this.first = false;
      }

      let matrixPair = document.createElement("div");
      matrixPair.classList.add("matrix-pair");

      let inputDisplay = this.createDisplayMatrix(input, "input");
      let resultDisplay = this.createDisplayMatrix(result, "result");

      matrixPair.appendChild(inputDisplay);
      matrixPair.appendChild(resultDisplay);
      this.display.appendChild(matrixPair);
   }


   // ---------------------------------------------------------------------------
   // Getters
   // ---------------------------------------------------------------------------
   /**
    * @returns The result of the last matrix operation.
    */
   lastResult() {
      return this.matrices[this.matrices.length - 1];
   }
}

const rowOpCalculator = new RowOperationsCalculator("_0");