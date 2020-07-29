'use strict';


// -----------------------------------------------------------
// Plus Minus Button Event
// -----------------------------------------------------------
/**
 * Adds click event listeners to the plus and minus buttons for the row and column inputs for the given matrix. 
 * 
 * @param {string} matrixClass The unique class of input elements for the matrix.
 */
function addIncrementBtnListeners(matrixClass) {
   let rowDim = document.querySelector(`.${matrixClass} .dim.row`);
   let colDim = document.querySelector(`.${matrixClass} .dim.col`);

   addListenerPerDim(rowDim);
   addListenerPerDim(colDim);
}

/**
 * Adds click event listeners to the plus and minus buttons for the passed dimension input (row or col).
 * 
 * @param {HTMLElement} dim The wrapper for the inputs.
 */
function addListenerPerDim(dim) {
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

function addDimInputListeners(matrixClass) {
   let rowInput = document.querySelector(`.${matrixClass}.row-in`);
   let colInput = document.querySelector(`.${matrixClass}.col-in`);
   let matrixWrapper = document.querySelector(`.${matrixClass}.matrix-wrapper`);

   rowInput.dataset.oldValue = rowInput.value;
   colInput.dataset.oldValue = colInput.value;

   rowInput.addEventListener('focus', () => rowInput.dataset.oldValue = rowInput.value);
   colInput.addEventListener('focus', () => colInput.dataset.oldValue = colInput.value);

   rowInput.addEventListener('change', () => handleRowChanges(rowInput, colInput, matrixWrapper, matrixClass));
   colInput.addEventListener('change', () => handleColChanges(colInput, rowInput, matrixWrapper, matrixClass));
}

function sanitizeInput(input) {
   input.value = Math.min(input.value, input.max);
   input.value = Math.max(input.value, input.min);
}

function handleRowChanges(rowInput, colInput, matrixWrapper, matrixClass) {

   sanitizeInput(rowInput);
   let rowsToAdd = rowInput.value - rowInput.dataset.oldValue;
   rowInput.dataset.oldValue = rowInput.value;

   if (rowsToAdd > 0) {
      addRows(rowsToAdd, rowInput.value, colInput.value, matrixWrapper, matrixClass);
   } else if(rowsToAdd < 0){
      removeRows(-rowsToAdd, colInput.value, matrixWrapper);
   }
}

function addRows(rowsToAdd, rows, columns, matrixWrapper, matrixClass) {
   for (let i = 0; i < rowsToAdd; i++) {
      let currentRow = rows + i;
      for (let col = 0; col < columns; col++) {
         matrixWrapper.appendChild(matrixEntrySpace(currentRow, col, matrixClass));
      }
   }
}

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