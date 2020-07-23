'use strict';

let rowInputs = document.querySelectorAll(".row-in");
let columnInputs = document.querySelectorAll(".col-in");
let matrixWrappers = document.querySelectorAll(".matrix-wrapper");
let rowLists = document.querySelectorAll(".row-list");
let matrices = [];

rowInputs.forEach((input, index) => input.addEventListener('change', () => createMatrixInput(index)));
columnInputs.forEach((input, index) => input.addEventListener('change', () => createMatrixInput(index)));

/**
 * Startup code goes here.
 */
window.onload = function () {
   matrixWrappers.forEach((m, index) => createMatrixInput(index));
}

/**
 * Generates an input grid for a matrix. 
 * 
 * @param {number} matrixIndex The matrix to generate.
 */
function createMatrixInput(matrixIndex) {
   let rows = rowInputs[matrixIndex].value;
   let columns = columnInputs[matrixIndex].value;
   let matrixWrapper = matrixWrappers[matrixIndex];
   matrixWrapper.innerHTML = "";

   for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
         matrixWrapper.appendChild(matrixEntrySpace(i + 1, j + 1));
      }
   }

   matrixWrapper.style.setProperty('grid-template-rows', `repeat(${rows}, auto)`);
   matrixWrapper.style.setProperty('grid-template-columns', `repeat(${columns}, auto)`);
   createRowList(rows);
}

/**
 * Generates the lists of rows to be used in selecting a row.
 * 
 * @param {number} rows 
 */
function createRowList(rows) {
   if (rowLists.length > 0) {

      let options = "";

      for (let row = 1; row <= rows; row++) {
         options += `<option value=${row}>${row}</option>`;
      }
      rowLists.forEach(list => list.innerHTML = options);
   }
}

/**
 * Creates a text input for the entry of the matrix at 
 * 
 * @param {number} row The row of the entry.
 * @param {number} columns The column of the entry. 
 */
function matrixEntrySpace(row, column) {
   let entrySpace = document.createElement('input');
   entrySpace.type = 'text';
   entrySpace.name = `${row},${column}`;
   entrySpace.id = `${row},${column}`;
   entrySpace.classList.add("entry");
   entrySpace.addEventListener("focus", () => entrySpace.select());
   return entrySpace;
}

/**
 * Populates a matrix from its input grid. 
 * 
 * @param {number} matrixIndex The matrix to populate.
 */
function populateMatrix(matrixIndex) {
   let rows = rowInputs[matrixIndex].value;
   let columns = columnInputs[matrixIndex].value;
   matrices[matrixIndex] = new Matrix(rows, columns);

   for (let i = 1; i <= rows; i++) {
      for (let j = 1; j <= columns; j++) {
         let val = document.getElementById(`${i},${j}`).value;
         matrices[matrixIndex].updateEntry(i, j, val);
      }
   }
}