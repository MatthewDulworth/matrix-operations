'use strict';

// -----------------------------------------------------------
// Variables
// -----------------------------------------------------------
const _rowInput = document.querySelector(".row-in");
const _columnInput = document.querySelector(".col-in");
const _matrixWrapper = document.querySelector(".matrix-wrapper");
const _rowLists = document.querySelectorAll(".row-list");


// -----------------------------------------------------------
// Startup Code
// -----------------------------------------------------------
/**
 * Generate an input matrix on startup.
 */
window.onload = function () {
   createMatrixInput("_0");
   createRowList(_rowLists, _rowInput);
   addIncrementBtnListeners("_0");
   addDimInputListeners("_0");
   addResetButtonListener("_0");
}


// -----------------------------------------------------------
// Event Listeners
// -----------------------------------------------------------
/**
 * Generate an input matrix whenever the row input or column input changes.
 */
// _rowInput.addEventListener('change', () => {
//    handleRowChanges("_0");
//    createRowList(_rowLists, _rowInput);
// });
// _columnInput.addEventListener('change', () => createMatrixInput("_0"));

// _rowInput.addEventListener('focus', () =>{ 
//    _rowInput.dataset.oldVal = _rowInput.value;
//    console.log("focus");
// });

// -----------------------------------------------------------
// Functions
// -----------------------------------------------------------
/**
 * Generates the lists of rows to be used in selecting a row.
 * @param {NodeList} rowLists The select elements.
 * @param {HTMLElement} rowInput The row input for the matrix.
 */
function createRowList(rowLists, rowInput) {
   if (rowLists.length > 0) {
      let rows = rowInput.value;
      let options = "";
      for (let row = 1; row <= rows; row++) {
         options += `<option value=${row}>${row}</option>`;
      }
      rowLists.forEach(list => list.innerHTML = options);
   }
}