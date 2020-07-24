'use strict';

let rowInput = document.querySelector(".row-in");
let columnInput = document.querySelector(".col-in");
let matrixWrapper = document.querySelector(".matrix-wrapper");
let rowLists = document.querySelectorAll(".row-list");

rowInput.addEventListener('change', () => {
   createMatrixInput("_0");
   createRowList(rowLists, rowInput);
});
columnInput.addEventListener('change', () =>{
   createMatrixInput("_0");
   createRowList(rowLists, rowInput);
}); 

/**
 * Startup code goes here.
 */
window.onload = function () {
   createMatrixInput("_0");
   createRowList(rowLists, rowInput);
}

/**
 * Generates the lists of rows to be used in selecting a row.
 * 
 * @param {number} rowLists 
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