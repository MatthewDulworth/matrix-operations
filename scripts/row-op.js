'use strict';

class RowOperationsCalculator {
   /**
    * 
    * @param {string} matrixID 
    */
   constructor(matrixID) {
      this.rowLists = document.querySelectorAll(".row-list");
      this.inputMatrixArray = JSON.parse(sessionStorage.getItem(matrixID));

      this.initialDisplayMatrix = document.querySelector("#initial .matrix-wrapper");
      this.finalDisplayMatrix = document.querySelector("#final .matrix-wrapper");

      this.multiplyBtn = document.getElementById("row-multiply");
      this.addBtn = document.getElementById("row-replace");
      this.swapBtn = document.getElementById("row-swap");

      this.multiplyBtn.addEventListener('click', this.multiply);
      this.addBtn.addEventListener('click', this.add);
      this.swapBtn.addEventListener('click', this.swap);

      this.displayMatrix(this.inputMatrixArray, this.initialDisplayMatrix);
      this.initRowLists(this.rowLists, this.inputMatrixArray.length);
   }

   /**
    * Generates the lists of rows to be used in selecting a row.
    * @param {NodeList} rowLists The select elements.
    * @param {number} rows The number of rows in the matrix.
    */
   initRowLists(rowLists, rows) {
      let options = "<option value=''></option>";
      for (let row = 1; row <= rows; row++) {
         options += `<option value=${row}>${row}</option>`;
      }
      rowLists.forEach(list => list.innerHTML = options);
   }

   /**
    * Displays the passed matrixArray on the screen. 
    * 
    * @param {string[][]} matrixArray The matrix to display.
    * @param {HTMLElement} matrixWrapper The element to house the matrix.
    */
   displayMatrix(matrixArray, matrixWrapper) {
      let rows = matrixArray.length;
      let columns = matrixArray[0].length;

      for (let row = 0; row < rows; row++) {
         for (let col = 0; col < columns; col++) {
            let entry = document.createElement('div');
            entry.textContent = matrixArray[row][col];
            matrixWrapper.appendChild(entry);
         }
      }

      matrixWrapper.parentElement.style.setProperty('display', 'block');
      matrixWrapper.style.setProperty('grid-template-rows', `repeat(${rows}, auto)`);
      matrixWrapper.style.setProperty('grid-template-columns', `repeat(${columns}, auto)`);
   }

   multiply() {

   }

   add() {

   }

   swap() {

   }

   validateInput(str) {

   }
}

const rowOpCalculator = new RowOperationsCalculator("_0");