'use strict';


// -----------------------------------------------------------
// Reset Button
// -----------------------------------------------------------
/**
 * Adds press event listener to reset button for the specified matrix class. 
 * @param {string} matrixClass The unique class of input elements for the matrix.
 */
function addResetButtonListener(matrixClass) {
   let resetBtn = document.querySelector(`.${matrixClass} .reset-btn`);
   let matrixWrapper = document.querySelector(`.${matrixClass}.matrix-wrapper`);
   resetBtn.addEventListener('click', () => matrixWrapper.childNodes.forEach(entry => entry.value = ""));
}

// -----------------------------------------------------------
// Plus Minus Button Handlers
// -----------------------------------------------------------
/**
 * Adds click event listeners to the plus and minus buttons for the row and column inputs for the given matrix. 
 * 
 * @param {string} matrixClass The unique class of input elements for the matrix.
 */
function addIncrementBtnListeners(matrixClass) {
   let rowDim = document.querySelector(`.${matrixClass} .dim.row`);
   let colDim = document.querySelector(`.${matrixClass} .dim.col`);

   addIncrementBtnListenerPerDim(rowDim);
   addIncrementBtnListenerPerDim(colDim);
}

/**
 * Adds click event listeners to the plus and minus buttons for the passed dimension input (row or col).
 * 
 * @param {HTMLElement} dim The wrapper for the inputs.
 */
function addIncrementBtnListenerPerDim(dim) {
   let plusBtn = dim.querySelector(".plus-btn");
   let minusBtn = dim.querySelector(".minus-btn");
   let input = dim.querySelector("input");

   incrementInput(plusBtn, input);
   plusBtn.addEventListener('click', () => incrementInput(input, true));
   minusBtn.addEventListener('click', () => incrementInput(input, false))
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
 * @param {string} matrixClass The unique class of input elements for the matrix.
 */
function addDimInputListeners(matrixClass) {
   let rowInput = document.querySelector(`.${matrixClass}.row-in`);
   let colInput = document.querySelector(`.${matrixClass}.col-in`);
   let matrixWrapper = document.querySelector(`.${matrixClass}.matrix-wrapper`);

   rowInput.dataset.oldValue = rowInput.value;
   colInput.dataset.oldValue = colInput.value;

   rowInput.addEventListener('focus', () => rowInput.select());
   colInput.addEventListener('focus', () => colInput.select());

   rowInput.addEventListener('change', () => handleRowChanges(rowInput, colInput.value, matrixWrapper, matrixClass));
   colInput.addEventListener('change', () => handleColChanges(colInput, rowInput.value, matrixWrapper, matrixClass));
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
 * @param {HTMLElement} matrixWrapper The input matrix. 
 * @param {string} matrixClass The unique class of input elements for the matrix.
 */
function handleColChanges(colInput, rows, matrixWrapper, matrixClass) {

   sanitizeToInt(colInput);
   let colsToAdd = colInput.value - colInput.dataset.oldValue;
   let columns = colInput.dataset.oldValue;
   colInput.dataset.oldValue = colInput.value;

   if (colsToAdd > 0) {
      addColumns(colsToAdd, rows, columns, matrixWrapper, matrixClass)
      matrixWrapper.style.setProperty('grid-template-columns', `repeat(${colInput.value}, auto)`);
   } else if (colsToAdd < 0) {
      removeColumns(-colsToAdd, rows, columns, matrixWrapper);
      matrixWrapper.style.setProperty('grid-template-columns', `repeat(${colInput.value}, auto)`);
   }
}

/**
 * Adds columns to an input matrix.
 * @param {number} colsToAdd The number of columns to add. 
 * @param {number} rows The current number of rows of the input matrix. 
 * @param {number} columns The current number of columns of the input matrix. 
 * @param {HTMLElement} matrixWrapper The input matrix. 
 * @param {string} matrixClass The unique class of input elements for the matrix.
 */
function addColumns(colsToAdd, rows, columns, matrixWrapper, matrixClass) {
   for (let i = 0; i < colsToAdd; i++) {
      let offset = 0;
      for (let row = 1; row <= rows; row++) {
         let colIndex = row * columns + offset;
         let entry = matrixEntrySpace(row - 1, colIndex, matrixClass);
         matrixWrapper.insertBefore(entry, matrixWrapper.childNodes[colIndex]);
         offset++;
      }
   }
}

/**
 * Removes columns from an input matrix. 
 * @param {number} colsToRemove The number of columns to remove. 
 * @param {number} rows The current number of rows of the input matrix. 
 * @param {number} columns The current number of columns of the input matrix. 
 * @param {HTMLElement} matrixWrapper The input matrix. 
 */
function removeColumns(colsToRemove, rows, columns, matrixWrapper) {
   for (let i = 0; i < colsToRemove; i++) {
      for (let row = rows; row > 0; row--) {
         let elementIndex = row * columns - 1;
         matrixWrapper.removeChild(matrixWrapper.childNodes[elementIndex]);
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
 * @param {HTMLElement} matrixWrapper The input matrix. 
 * @param {string} matrixClass The unique class of input elements for the matrix.
 */
function handleRowChanges(rowInput, columns, matrixWrapper, matrixClass) {

   sanitizeToInt(rowInput);
   let rowsToAdd = rowInput.value - rowInput.dataset.oldValue;
   rowInput.dataset.oldValue = rowInput.value;

   if (rowsToAdd > 0) {
      addRows(rowsToAdd, rowInput.value, columns, matrixWrapper, matrixClass);
      matrixWrapper.style.setProperty('grid-template-rows', `repeat(${rowInput.value}, auto)`);
   } else if (rowsToAdd < 0) {
      removeRows(-rowsToAdd, columns, matrixWrapper);
      matrixWrapper.style.setProperty('grid-template-rows', `repeat(${rowInput.value}, auto)`);
   }
}

/**
 * Adds rows to an input matrix. 
 * @param {number} rowsToAdd The number of rows to add. 
 * @param {number} rows The current number of rows of the input matrix.
 * @param {number} columns The current number of columns of the input matrix.
 * @param {HTMLElement} matrixWrapper The input matrix. 
 * @param {HTMLElement} matrixClass The unique class of input elements for the matrix.
 */
function addRows(rowsToAdd, rows, columns, matrixWrapper, matrixClass) {
   for (let i = 0; i < rowsToAdd; i++) {
      let currentRow = rows + i;
      for (let col = 0; col < columns; col++) {
         matrixWrapper.appendChild(matrixEntrySpace(currentRow, col, matrixClass));
      }
   }
}

/**
 * Removes rows from an input matrix. 
 * @param {number} rowsToRemove The number of rows to remove. 
 * @param {number} columns The number of columns of the input matrix. 
 * @param {HTMLElement} matrixWrapper The input matrix.
 */
function removeRows(rowsToRemove, columns, matrixWrapper) {
   for (let i = 0; i < rowsToRemove; i++) {
      for (let col = 0; col < columns; col++) {
         matrixWrapper.removeChild(matrixWrapper.lastChild);
      }
   }
}


// -----------------------------------------------------------
// Generate Matrix Input Grid
// -----------------------------------------------------------
/**
 * Generates an input grid for a matrix. 
 * @param {string} matrixClass The unique class of input elements for the matrix.
 */
function createMatrixInput(matrixClass) {
   let rows = document.querySelector(`.row-in.${matrixClass}`).value;
   let columns = document.querySelector(`.col-in.${matrixClass}`).value;
   let matrixWrapper = document.querySelector(`.matrix-wrapper.${matrixClass}`);
   matrixWrapper.innerHTML = "";

   for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
         matrixWrapper.appendChild(matrixEntrySpace(row, col, matrixClass));
      }
   }

   matrixWrapper.style.setProperty('grid-template-rows', `repeat(${rows}, auto)`);
   matrixWrapper.style.setProperty('grid-template-columns', `repeat(${columns}, auto)`);
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