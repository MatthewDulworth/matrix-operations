'use strict';

// -----------------------------------------------------------
// Variables
// -----------------------------------------------------------
const _rowInput = document.querySelector(".row-in");
const _columnInput = document.querySelector(".col-in");
const _matrixWrapper = document.querySelector(".matrix-wrapper");
const _rowLists = document.querySelectorAll(".row-list");

/**@type {string[][]} */
const _matrix_ = [];

// -----------------------------------------------------------
// Startup Code
// -----------------------------------------------------------
/**
 * Generate an input matrix on startup.
 */
window.onload = function () {
   initInputMatrix("_0");
   createRowList(_rowLists, _rowInput);
}

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
 * Generates a matrix (2d array of strings) from the values of a a given input matrix. 
 * @param {HTMLElement} inputMatrix 
 * @returns {string[][]}
 */
function generateMatrix(inputMatrix) {

}

/**
 * Checks if the passed string is either a decimal number or a fraction. 
 * 
 * The decimal point can either be a comma {,} or a period {.}.
 * The value can only have one decimal point. 
 * 
 * Fraction numerator and denominators can only be integers.
 * Denominators cannot be zero. 
 * 
 * e.g. 
 * 2.345 | 2,345 | 234. | ,345 are all valid decimal numbers
 * while 2,345.5 | 2,.345 | 2.3.4 are not. 
 *
 * 2/3 | 345/345 | 12/1 | 0/1 are all valid fractions
 * while 2.0/3.0 | 1/0 | are not. 
 * 
 * @param {string} value The string to validate. 
 * @returns {Boolean} True if the input meets the requirements, false otherwise.
 */
function inputIsValid(value) {
   if (value.length > 0) {
      const regex = new RegExp(/^-?\d*(?:[.,]\d*)?$|^-?[1-9][0-9]*\/[1-9][0-9]*$/g);
      return regex.test(value);
   } else {
      return false;
   }
}

/**
 * @param {string} str The string to remove whitespace from. 
 * @returns {string} The string with whitespace removed.
 */
function removeWhiteSpace(str) {
   return str.replace(/\s+/g, '');
}