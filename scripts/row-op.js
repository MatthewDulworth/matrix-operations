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

      this.steplist = new StepList(new Matrix(matrixArray.length, matrixArray[0].length, matrixArray))
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

      this.display.firstElementChild.appendChild(this.createDisplayMatrix(this.steplist.last(), "input"));
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
   tryOperation(operation, params, msg, button) {
      let result;

      try {
         result = operation(...params);
      } catch (error) {
         alert("Invalid Input");
      }

      if (result !== undefined) {
         this.steplist.addStep(result, msg);
         this.displayOperation();
         button.scrollIntoView();
      }
   }

   /**
    * Multiplies a row by a scalar and displays the output.
    */
   multiply() {
      let targetRow = parseInt(document.querySelector("#row-multiply select").value) - 1;
      let scalar = document.querySelector("#row-multiply input").value;
      let params = [targetRow, scalar];
      let msg = `Multiplied row ${targetRow + 1} by ${scalar}.`;
      this.tryOperation(this.steplist.last().rowMultiplication.bind(this.steplist.last()), params, msg, this.multiplyBtn);
   }

   /**
    * Adds a scalar times a row to another row and displays the result.
    */
   add() {
      let targetRow = parseInt(document.querySelector("#row-replace select:nth-of-type(2)").value) - 1;
      let actorRow = parseInt(document.querySelector("#row-replace select:nth-of-type(1)").value) - 1;
      let scalar = document.querySelector("#row-replace input").value;
      let params = [targetRow, actorRow, scalar];
      let msg = `Added ${scalar} times row ${actorRow + 1} to ${targetRow + 1}.`;
      this.tryOperation(this.steplist.last().rowReplacement.bind(this.steplist.last()), params, msg, this.addBtn);
   }

   /**
    * Swaps two rows and displays the result.
    */
   swap() {
      let targetRow = parseInt(document.querySelector("#row-swap select:nth-of-type(2)").value) - 1;
      let actorRow = parseInt(document.querySelector("#row-swap select:nth-of-type(1)").value) - 1;
      let params = [targetRow, actorRow];
      let msg = `Swapped row ${actorRow + 1} and row ${targetRow + 1}`;
      this.tryOperation(this.steplist.last().rowSwap.bind(this.steplist.last()), params, msg, this.swapBtn);
   }

   /**
    * Row reduces matrix and displays the result.
    */
   reduce() {
      let list;

      try {
         list = this.steplist.last().rref();
      } catch (error) {
         alert("Invalid Input");
      }

      if (list !== undefined) {
         if (list.length === 1) {
            this.steplist.addStep(list.matrices[0], "Already in row reduced form.");
            this.displayOperation();
         } else {
            for (let i = 1; i < list.length; i++) {
               this.steplist.addStep(list.matrices[i], list.instructions[i]);
               this.displayOperation();
            }
         }
         this.reduceBtn.scrollIntoView();
      }
   }


   // ---------------------------------------------------------------------------
   // Display Matrix
   // ---------------------------------------------------------------------------
   /**
    * Displays an operation on the page. 
    */
   displayOperation() {

      if (this.first) {
         this.display.firstElementChild.remove();
         this.first = false;
      }

      let result = this.steplist.last();
      let input = this.steplist.nextToLast();
      let msg = this.steplist.lastMsg();

      if (input == null || result == null || msg == null) {
         throw Error("idk man");
      }

      let inputDisplay = this.createDisplayMatrix(input, "input");
      let resultDisplay = this.createDisplayMatrix(result, "result");

      let msgDisplay = document.createElement("div");
      msgDisplay.classList.add("operation-msg");
      msgDisplay.innerHTML = msg;

      let arrow = document.createElement('div');
      arrow.style.setProperty('margin-top', '5px');
      arrow.style.setProperty('margin-right', '10px');
      arrow.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill-rule="evenodd" d="M13.22 19.03a.75.75 0 001.06 0l6.25-6.25a.75.75 0 000-1.06l-6.25-6.25a.75.75 0 10-1.06 1.06l4.97 4.97H3.75a.75.75 0 000 1.5h14.44l-4.97 4.97a.75.75 0 000 1.06z"></path></svg>';

      let matrixPair = document.createElement("div");
      matrixPair.classList.add("matrix-pair");

      matrixPair.appendChild(inputDisplay);
      matrixPair.appendChild(arrow);
      matrixPair.appendChild(resultDisplay);
      matrixPair.appendChild(msgDisplay);

      this.display.appendChild(matrixPair);
   }

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
}

const rowOpCalculator = new RowOperationsCalculator("_0");