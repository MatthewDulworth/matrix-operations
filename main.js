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
         matrixWrapper.appendChild(matrixEntrySpace(`${i},${j}`));
      }
   }

   matrixWrapper.style.setProperty('grid-template-rows', `repeat(${rows}, auto)`);
   matrixWrapper.style.setProperty('grid-template-columns', `repeat(${columns}, auto)`);
}

function matrixEntrySpace(id) {
   let entrySpace = document.createElement('input');
   entrySpace.type = 'text';
   entrySpace.name = id;
   entrySpace.id = id;
   return entrySpace;
}