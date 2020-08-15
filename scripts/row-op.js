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

      this.steps = new StepList(new Matrix(matrixArray.length, matrixArray[0].length, matrixArray));
      this.stepIndex = 0;
      this.first = true;
      this.matrixID = matrixID;

      this.rowLists = document.querySelectorAll(".row-list");
      this.display = document.getElementById("display");

      this.undoBtn = document.getElementById("undo");
      this.redoBtn = document.getElementById("redo");
      this.editBtn = document.getElementById("edit");

      this.multiplyBtn = document.querySelector("#row-multiply button");
      this.addBtn = document.querySelector("#row-replace button");
      this.swapBtn = document.querySelector("#row-swap button");

      this.echelonBtn = document.getElementById("row-echelon");
      this.reduceBtn = document.getElementById("row-reduce");

      this.undoBtn.addEventListener('click', () => this.handleUndo());
      this.redoBtn.addEventListener('click', () => this.handleRedo());
      this.editBtn.addEventListener('click', () => this.handleEdit());
      
      this.multiplyBtn.addEventListener('click', () => this.multiply());
      this.addBtn.addEventListener('click', () => this.add());
      this.swapBtn.addEventListener('click', () => this.swap());

      this.reduceBtn.addEventListener('click', () => this.reduce());
      this.echelonBtn.addEventListener('click', () => this.rowEchelon());

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
   // Row Operations
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
         
         let actorRow = null;
         if(typeof params[1] != "string") {
            actorRow = params[1];
         }

         this.addStep(result, msg, params[0], actorRow);
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
      let msg = `Multiply row ${targetRow + 1} by ${scalar}.`;
      this.tryOperation(this.lastResult().rowMultiplication.bind(this.lastResult()), params, msg, this.multiplyBtn);
   }

   /**
    * Adds a scalar times a row to another row and displays the result.
    */
   add() {
      let targetRow = parseInt(document.querySelector("#row-replace select:nth-of-type(2)").value) - 1;
      let actorRow = parseInt(document.querySelector("#row-replace select:nth-of-type(1)").value) - 1;
      let scalar = document.querySelector("#row-replace input").value;
      let params = [targetRow, actorRow, scalar];
      let msg = `Add ${scalar} times row ${actorRow + 1} to row ${targetRow + 1}.`;
      this.tryOperation(this.lastResult().rowReplacement.bind(this.lastResult()), params, msg, this.addBtn);
   }

   /**
    * Swaps two rows and displays the result.
    */
   swap() {
      let targetRow = parseInt(document.querySelector("#row-swap select:nth-of-type(2)").value) - 1;
      let actorRow = parseInt(document.querySelector("#row-swap select:nth-of-type(1)").value) - 1;
      let params = [targetRow, actorRow];
      let msg = `Swap row ${actorRow + 1} with row ${targetRow + 1}.`;
      this.tryOperation(this.lastResult().rowSwap.bind(this.lastResult()), params, msg, this.swapBtn);
   }

   // ---------------------------------------------------------------------------
   // Row Reduction
   // ---------------------------------------------------------------------------
   /**
    * 
    * @param {Function} reduction 
    * @param {string} alreadyDoneMsg 
    * @param {HTMLElement} button 
    */
   tryMultiple(reduction, alreadyDoneMsg, button) {

      /**@type {StepList} */
      let steplist;

      try {
         steplist = reduction();
      } catch (error) {
         alert("Invalid Input");
      }

      if (steplist !== undefined) {
         if (steplist.length === 1) {
            this.addStep(steplist.matrices[0], alreadyDoneMsg, null, null);
            this.displayOperation();
         } else {
            for (let i = 1; i < steplist.length; i++) {
               this.addStep(steplist.matrices[i], steplist.instructions[i], steplist.targetRows[i], steplist.actorRows[i]);
               this.displayOperation();
            }
         }
         button.scrollIntoView();
      }
   }

   /**
    * Row reduces matrix and displays the result.
    */
   rowEchelon() {
      let alreadyDoneMsg = "Matrix is already in row echelon form.";
      let reduction = this.lastResult().ref.bind(this.lastResult());
      this.tryMultiple(reduction, alreadyDoneMsg, this.echelonBtn);
   }

   /**
    * Row reduces matrix and displays the result.
    */
   reduce() {
      let alreadyDoneMsg = "Matrix is already in reduced row echelon form.";
      let reduction = this.lastResult().rref.bind(this.lastResult());
      this.tryMultiple(reduction, alreadyDoneMsg, this.reduceBtn);
   }


   // ---------------------------------------------------------------------------
   // Display Matrix
   // ---------------------------------------------------------------------------
   /**
    * Displays an operation on the page. 
    * @throws "idk man" if the input matrix, result matrix, or operation message are null.
    */
   displayOperation() {

      if (this.first) {
         this.display.firstElementChild.remove();
         this.first = false;
      }

      let result = this.lastResult();
      let input = this.nextToLastResult();
      let msg = this.lastMsg();

      if (input == null || result == null || msg == null) {
         throw Error("idk man");
      }

      let inputDisplay = this.createDisplayMatrix(input, "input");
      let resultDisplay = this.createDisplayMatrix(result, "result");

      let msgDisplay = this.createMessageDisplay(msg);

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

      const targetRow = this.lastTargetRow();
      const actorRow = this.lastActorRow();

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
            if(row === targetRow) {
               entry.style.setProperty('color', 'red');
            } else if(row === actorRow) {
               entry.style.setProperty('color', 'blue');
            }
            displayMatrix.appendChild(entry);
         }
      }

      displayMatrix.style.setProperty('grid-template-rows', `repeat(${matrix.rows}, auto)`);
      displayMatrix.style.setProperty('grid-template-columns', `repeat(${matrix.columns}, auto)`);

      return displayMatrix;
   }

   /**
    * 
    * @param {string} msg 
    */
   createMessageDisplay(msg) {
      let msgDisplay = document.createElement("div");
      msgDisplay.classList.add("operation-msg");
      msgDisplay.innerHTML = msg;
      return msgDisplay;
   }

   // ---------------------------------------------------------------------------
   // Undo and Edit
   // ---------------------------------------------------------------------------

   /**
    * Undoes the last step taken.
    */
   handleUndo() {
      if (this.undoStep()) {
         if (this.stepIndex === 0) {
            let displayMatrix = this.display.firstElementChild.querySelector(".input").cloneNode(true);
            this.display.firstElementChild.innerHTML = "";
            this.display.firstElementChild.appendChild(displayMatrix);
            this.first = true;
         } else {
            this.display.lastChild.remove();
         }
         this.undoBtn.scrollIntoView();
      }
   }

   /**
    * Redoes the last undone step.
    */
   handleRedo() {
      if (this.redoStep()) {
         this.displayOperation();
         this.redoBtn.scrollIntoView();
      }
   }

   /**
    * Allows user to edit the last result
    */
   handleEdit() {
      let matrixJSON = JSON.stringify(this.lastResult().toString());
      sessionStorage.setItem(this.matrixID, matrixJSON);
      window.location.href = '../html/row-op-input.html';
   }


   // ---------------------------------------------------------------------------
   // Memory
   // ---------------------------------------------------------------------------

   /**
    * Accounts for undos and redos.
    * Returns null if the result does not exist.
    * @returns The result of the last operation taken.
    */
   lastResult() {
      try {
         return this.steps.matrices[this.stepIndex];
      } catch (e) {
         return null;
      }
   }

   /**
    * Accounts for undos and redos.
    * Returns null if the result does not exist.
    * @returns The result of the next last operation taken.
    */
   nextToLastResult() {
      try {
         return this.steps.matrices[this.stepIndex - 1];
      } catch (e) {
         return null;
      }
   }

   /**
    * Accounts for undos and redos.
    * Returns null if the message does not exist.
    * @returns The message of the last operation taken.
    */
   lastMsg() {
      try {
         return this.steps.instructions[this.stepIndex];
      } catch (e) {
         return null;
      }
   }

   /**
    * Accounts for undos and redos.
    * Returns null if the message does not exist.
    * @returns The row the last operation was taken on.
    */
   lastTargetRow() {
      try {
         return this.steps.targetRows[this.stepIndex];
      } catch (e) {
         return null;
      }
   }

   /**
    * Accounts for undos and redos.
    * Returns null if the message does not exist.
    * @returns The row the last operation was taken on.
    */
   lastActorRow() {
      try {
         return this.steps.actorRows[this.stepIndex];
      } catch (e) {
         return null;
      }
   }

   /**
    * Stores the result and message from an operation. 
    * Clears any previously undone operations.
    * @param {Matrix} result The result of the operation taken. 
    * @param {string} msg The message of the operation taken. 
    */
   addStep(result, msg, targetRow, actorRow) {
      // If the last step taken not the last step stored, clear all steps above it.
      if (this.stepIndex != this.steps.length - 1) {
         this.steps = this.steps.range(0, this.stepIndex);
      }
      // add the step.
      this.steps.addStep(result, msg, targetRow, actorRow);
      this.stepIndex++;
      console.log(targetRow, actorRow);
   }

   /**
    * Undoes the last step if possible.
    * @returns {boolean} True if a step was undone. False otherwise. 
    */
   undoStep() {
      // If there are previous steps, set the last step to the previous step. 
      if (this.stepIndex - 1 >= 0) {
         this.stepIndex--;
         return true;
      } else {
         return false;
      }
   }

   /**
    * Redoes the last undone step if possible.
    * @returns {boolean} True if a step was redone. False otherwise.
    */
   redoStep() {
      // If there are steps taken after the last step, set the last step the to the next step.
      if (this.stepIndex + 1 < this.steps.length) {
         this.stepIndex++;
         return true;
      } else {
         return false;
      }
   }
}

const matrixID = "A";
const rowOpCalculator = new RowOperationsCalculator(matrixID);