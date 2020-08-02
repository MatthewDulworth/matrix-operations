'use strict';

// -----------------------------------------------------------
// Constants
// -----------------------------------------------------------
const rowLists = document.querySelectorAll(".row-list");
const initialMatrix = document.querySelector("#initial .matrix-wrapper");
const finalMatrix = document.getElementById("#final .matrix-wrapper");
const inputMatrixArray = JSON.parse(sessionStorage.getItem("_0"));

// matrix 
let matrix = new Matrix(inputMatrixArray.length, inputMatrixArray[0].length, inputMatrixArray);
console.log(matrix);

// -----------------------------------------------------------
// Main
// -----------------------------------------------------------
generateDisplayMatrix(inputMatrixArray, initialMatrix);

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

/**
 * Displays the passed matrixArray on the screen. 
 * 
 * @param {string[][]} matrixArray The matrix to display.
 * @param {HTMLElement} displayMatrix The element to house the matrix.
 */
function generateDisplayMatrix(matrix, displayMatrix) {
   let rows = matrix.length;
   let columns = matrix[0].length;

   for(let row = 0; row<rows; row++){
      for(let col=0; col<columns; col++){
        let entry = document.createElement('div');
        entry.textContent = matrix[row][col];
        displayMatrix.appendChild(entry);
      }
   }

   displayMatrix.parentElement.style.setProperty('display', 'block');
   displayMatrix.style.setProperty('grid-template-rows', `repeat(${rows}, auto)`);
   displayMatrix.style.setProperty('grid-template-columns', `repeat(${columns}, auto)`);
}