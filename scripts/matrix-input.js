'use strict';

// -----------------------------------------------------------
// Init Input Matrix.
// -----------------------------------------------------------
/**
 * Creates the initial input matrix and adds event listeners to all buttons and inputs related to the matrix.
 * @param {string} matrixClass The unique class of input elements for the matrix.
 */
function initInputMatrix(matrixInput) {

   createMatrixInput(matrixInput);
   addResetButtonListener(matrixInput);
   addIncrementBtnListeners(matrixInput);
   addDimInputListeners(matrixInput);
}

// -----------------------------------------------------------
// Create Matrix Button
// -----------------------------------------------------------
/**
 * 
 * @param {string[][]} matrix 
 * @param {string} matrixClass 
 */
function generateMatrix(rows, columns, matrixClass) {
   let finalMatrix = document.querySelector(`.${matrixClass}.final-matrix`);
   finalMatrix.innerHTML = "";

   for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
         let entry = document.createElement('div');
         entry.textContent = _matrix[row][col];
         finalMatrix.appendChild(entry);
      }
   }

   finalMatrix.style.setProperty('grid-template-rows', `repeat(${rows}, auto)`);
   finalMatrix.style.setProperty('grid-template-columns', `repeat(${columns}, auto)`);
   finalMatrix.classList.remove("display-none");

   console.log(_matrix);
}

// -----------------------------------------------------------
// Reset Button
// -----------------------------------------------------------
/**
 * Adds click event listener to reset button for the specified matrix class.
 * Sets all the value of all entries in the input matrix to nothing. 
 * @param {string} matrixInput
 */
function addResetButtonListener(matrixInput) {
   matrixInput.resetBtn.addEventListener('click', () => matrixInput.matrix.childNodes.forEach(entry => entry.value = ""));
}

// -----------------------------------------------------------
// Plus Minus Button Handlers
// -----------------------------------------------------------
/**
 * Adds click event listeners to the plus and minus buttons for the row and column inputs for the given matrix. 
 * @param {string} matrixInput 
 */
function addIncrementBtnListeners(matrixInput) {
   matrixInput.row.plusBtn.addEventListener('click', () => incrementInput(matrixInput.row.input, true));
   matrixInput.row.minusBtn.addEventListener('click', () => incrementInput(matrixInput.row.input, false));
   matrixInput.col.plusBtn.addEventListener('click', () => incrementInput(matrixInput.col.input, true));
   matrixInput.col.minusBtn.addEventListener('click', () => incrementInput(matrixInput.col.input, false));
}

/**
 * Increments or decrements the input.
 * Constrained by input max and min.
 * 
 * @param {HTMLElement} input The text input to change.
 * @param {number} sign (optional) pass -1 if btn is a minus-btn.
 */
function incrementInput(input, decrement = true) {
   let sign = (decrement) ? 1 : -1;
   let value = parseInt(input.value) + 1 * sign;
   if (value <= parseInt(input.max) && value >= parseInt(input.min)) {
      input.value = value;
   }
   triggerEvent(input, 'change');
}


// -----------------------------------------------------------
// Dimension Input Listeners
// -----------------------------------------------------------
/**
 * Adds event listeners to the row and column inputs of the specified matrix class. 
 * On change calls the handle row and handle col functions.
 * On focus selects the input text.
 * @param {Object} matrixInput The unique class of input elements for the matrix.
 */
function addDimInputListeners(matrixInput) {

   let rows = matrixInput.row.input.value;
   let cols = matrixInput.col.input.value;
  
   matrixInput.row.input.dataset.oldValue = rows;
   matrixInput.col.input.dataset.oldValue = cols;

   matrixInput.row.input.addEventListener('focus', () => matrixInput.row.input.select());
   matrixInput.col.input.addEventListener('focus', () => matrixInput.col.input.select());

   matrixInput.row.input.addEventListener('change', () => handleRowChanges(matrixInput.row.input, cols, matrixInput.matrix, matrixInput.class));
   matrixInput.col.input.addEventListener('change', () => handleColChanges(matrixInput.col.input, rows, matrixInput.matrix, matrixInput.class));
}

/**
 * Bounds the value of the input element to its min and max, and makes the input value an integer. 
 * Tries to parse the value into an integer, if it cannot, sets the value to zero.
 * @param {HTMLElement} input The input element. 
 */
function sanitizeToInt(input) {
   let val = parseInt(input.value);

   if (isNaN(val)) {
      input.value = 0;
   } else {
      input.value = Math.max(Math.min(val, input.max), input.min);
   }
}


// -----------------------------------------------------------
// Handle Column Changes 
// -----------------------------------------------------------

/**
 * Handles the changes to a column input.
 * Adds or removes columns from the appropriate input matrix as necessary.
 * Sanitizes column input value.  
 * @param {HTMLElement} colInput The column input for the input matrix.
 * @param {number} rows The number of rows in the input matrix.
 * @param {HTMLElement} inputMatrix The input matrix. 
 * @param {string} matrixClass The unique class of input elements for the matrix.
 */
function handleColChanges(colInput, rows, inputMatrix, matrixClass) {

   sanitizeToInt(colInput);
   let colsToAdd = colInput.value - colInput.dataset.oldValue;
   let columns = colInput.dataset.oldValue;
   colInput.dataset.oldValue = colInput.value;

   if (colsToAdd > 0) {
      addColumns(colsToAdd, rows, columns, inputMatrix, matrixClass)
      inputMatrix.style.setProperty('grid-template-columns', `repeat(${colInput.value}, auto)`);
   } else if (colsToAdd < 0) {
      removeColumns(-colsToAdd, rows, columns, inputMatrix);
      inputMatrix.style.setProperty('grid-template-columns', `repeat(${colInput.value}, auto)`);
   }
}

/**
 * Adds columns to an input matrix.
 * @param {number} colsToAdd The number of columns to add. 
 * @param {number} rows The current number of rows of the input matrix. 
 * @param {number} columns The current number of columns of the input matrix. 
 * @param {HTMLElement} inputMatrix The input matrix. 
 * @param {string} matrixClass The unique class of input elements for the matrix.
 */
function addColumns(colsToAdd, rows, columns, inputMatrix, matrixClass) {
   for (let i = 0; i < colsToAdd; i++) {
      let offset = 0;
      for (let row = 1; row <= rows; row++) {
         let colIndex = row * columns + offset;
         let entry = matrixEntrySpace(row - 1, colIndex, matrixClass);
         inputMatrix.insertBefore(entry, inputMatrix.childNodes[colIndex]);
         offset++;
      }
   }
}

/**
 * Removes columns from an input matrix. 
 * @param {number} colsToRemove The number of columns to remove. 
 * @param {number} rows The current number of rows of the input matrix. 
 * @param {number} columns The current number of columns of the input matrix. 
 * @param {HTMLElement} inputMatrix The input matrix. 
 */
function removeColumns(colsToRemove, rows, columns, inputMatrix) {
   for (let i = 0; i < colsToRemove; i++) {
      for (let row = rows; row > 0; row--) {
         let elementIndex = row * columns - 1;
         inputMatrix.removeChild(inputMatrix.childNodes[elementIndex]);
      }
      columns--;
   }
}


// -----------------------------------------------------------
// Handle Row Changes 
// -----------------------------------------------------------

/**
 * Handles the changes to a row input.
 * Adds or removes rows from the appropriate input matrix as necessary. 
 * Sanitizes row input value.
 * @param {HTMLElement} rowInput The row input for the input matrix.
 * @param {number} columns The number of columns in the input matrix.
 * @param {HTMLElement} inputMatrix The input matrix. 
 * @param {string} matrixClass The unique class of input elements for the matrix.
 */
function handleRowChanges(rowInput, columns, inputMatrix, matrixClass) {

   sanitizeToInt(rowInput);
   let rowsToAdd = rowInput.value - rowInput.dataset.oldValue;
   rowInput.dataset.oldValue = rowInput.value;

   if (rowsToAdd > 0) {
      addRows(rowsToAdd, rowInput.value, columns, inputMatrix, matrixClass);
      inputMatrix.style.setProperty('grid-template-rows', `repeat(${rowInput.value}, auto)`);
   } else if (rowsToAdd < 0) {
      removeRows(-rowsToAdd, columns, inputMatrix);
      inputMatrix.style.setProperty('grid-template-rows', `repeat(${rowInput.value}, auto)`);
   }
}

/**
 * Adds rows to an input matrix. 
 * @param {number} rowsToAdd The number of rows to add. 
 * @param {number} rows The current number of rows of the input matrix.
 * @param {number} columns The current number of columns of the input matrix.
 * @param {HTMLElement} inputMatrix The input matrix. 
 * @param {HTMLElement} matrixClass The unique class of input elements for the matrix.
 */
function addRows(rowsToAdd, rows, columns, inputMatrix, matrixClass) {
   for (let i = 0; i < rowsToAdd; i++) {
      let currentRow = rows + i;
      for (let col = 0; col < columns; col++) {
         inputMatrix.appendChild(matrixEntrySpace(currentRow, col, matrixClass));
      }
   }
}

/**
 * Removes rows from an input matrix. 
 * @param {number} rowsToRemove The number of rows to remove. 
 * @param {number} columns The number of columns of the input matrix. 
 * @param {HTMLElement} inputMatrix The input matrix.
 */
function removeRows(rowsToRemove, columns, inputMatrix) {
   for (let i = 0; i < rowsToRemove; i++) {
      for (let col = 0; col < columns; col++) {
         inputMatrix.removeChild(inputMatrix.lastChild);
      }
   }
}


// -----------------------------------------------------------
// Generate Matrix Input Grid
// -----------------------------------------------------------
/**
 * Generates an input grid for a matrix. 
 * @param {Object} matrixInput 
 */
function createMatrixInput(matrixInput) {
   let rows = matrixInput.row.input.value;
   let columns = matrixInput.col.input.value;
   matrixInput.matrix.innerHTML = "";

   for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
         matrixInput.matrix.appendChild(matrixEntrySpace(row, col, matrixInput.class));
      }
   }

   matrixInput.matrix.style.setProperty('grid-template-rows', `repeat(${rows}, auto)`);
   matrixInput.matrix.style.setProperty('grid-template-columns', `repeat(${columns}, auto)`);
}

/**
 * Creates a text input for the entry of the matrix.
 * @param {number} row The row of the entry.
 * @param {number} column The column of the entry. 
 * @param {string} matrixClass The unique class of input elements for the matrix.
 * @returns {HTMLElement} A text input.
 */
function matrixEntrySpace(row, column, matrixClass) {
   let entrySpace = document.createElement('input');
   entrySpace.type = 'text';
   entrySpace.name = `${row}_${column}`;
   entrySpace.classList.add("entry");
   entrySpace.classList.add(`${matrixClass}_${row}_${column}`);
   entrySpace.addEventListener("focus", () => entrySpace.select());
   return entrySpace;
}

// adapted from https://plainjs.com/javascript/events/trigger-an-event-11/
function triggerEvent(el, type) {
   if ('createEvent' in document) {
      // modern browsers, IE9+
      var e = document.createEvent('HTMLEvents');
      e.initEvent(type, false, true);
      el.dispatchEvent(e);
   } else {
      // IE 8
      var e = document.createEventObject();
      e.eventType = type;
      el.fireEvent('on' + e.eventType, e);
   }
}