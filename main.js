'use strict';

let submitBtn = document.querySelector("#submit button");
let rowInput = document.querySelector("#rows");
let columnInput = document.querySelector("#columns");
let matrixWrapper = document.querySelector("#matrix-wrapper");

submitBtn.addEventListener('click', () => createMatrix(rowInput.value, columnInput.value));

/**
 * Creates an empty matrix and displays it on the screen.
 * 
 * @param {number} rows The number of rows.
 * @param {number} columns The number of columns.
 */
function createMatrix(rows, columns) {
   matrixWrapper.innerHTML = "";

   for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
         matrixWrapper.appendChild(matrixEntrySpace(i + 1, j + 1));
      }
   }

   matrixWrapper.style.setProperty('grid-template-rows', `repeat(${rows}, auto)`);
   matrixWrapper.style.setProperty('grid-template-columns', `repeat(${columns}, auto)`);
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
   return entrySpace;
}