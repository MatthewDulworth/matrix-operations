'use strict';

/**
 * Generates an input grid for a matrix. 
 * 
 * @param {string} matrixClass The unique class of input elements for the matrix.
 */
function createMatrixInput(matrixClass) {
   let rows = document.querySelector(`.row-in.${matrixClass}`).value;
   let columns = document.querySelector(`.col-in.${matrixClass}`).value;
   let matrixWrapper = document.querySelector(`.matrix-wrapper.${matrixClass}`);
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
 * @param {number} column The column of the entry. 
 */
function matrixEntrySpace(row, column, matrixClass) {
   let entrySpace = document.createElement('input');
   entrySpace.type = 'text';
   entrySpace.name = `${row},${column}`;
   entrySpace.classList.add("entry");
   entrySpace.classList.add(`_${row},${column}`);
   entrySpace.addEventListener("focus", () => entrySpace.select());
   return entrySpace;
}