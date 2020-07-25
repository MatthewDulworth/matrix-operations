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

   addBtnListener(plusBtn, input);
   addBtnListener(minusBtn, input, -1);
}

/**
 * Adds click event listener to the passed plus or minus button.
 * Increments or decrements the input if plus or minus button. 
 * Constrained by input max and min.
 * 
 * @param {HTMLElement} btn The button to add the listener to.
 * @param {HTMLElement} input The text input to change.
 * @param {number} sign (optional) pass -1 if btn is a minus-btn.
 */
function addBtnListener(btn, input, sign = 1) {
   btn.addEventListener('click', () => {
      let value = parseInt(input.value) + 1 * sign;

      if (isNaN(value)) {
         throw Error("input invalid");
      } else if (value <= parseInt(input.max) && value >= parseInt(input.min)) {
         input.value = value;
      }
   });
}

function handleRowChanges(matrixClass) {

   let columns = document.querySelector(`.col-in.${matrixClass}`).value;
   let matrixWrapper = document.querySelector(`.matrix-wrapper.${matrixClass}`);
   let rowInput = document.querySelector(`.row-in.${matrixClass}`);
   let row = rowInput.value + 1;

   if (rowInput.dataset.oldVal < rowInput.value) {
      for (let col = 0; col < columns; col++) {
         matrixWrapper.appendChild(matrixEntrySpace(row, col, matrixClass));
      }
   } else if (rowInput.dataset.oldVal < rowInput.value) {
      for (let col = 0; col < columns; col++) {
         matrixWrapper.lastElementChild.remove();
      }
   } else {
      console.log("huh, thats weird");
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