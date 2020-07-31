'use strict';

// -----------------------------------------------------------
// Constants
// -----------------------------------------------------------
/**@type {MatrixInput} */
const _matrixInput = new MatrixInput("_0");; 

/**@type {string[][]} */
const _matrix = [];

// -----------------------------------------------------------
// Functions
// -----------------------------------------------------------
/**
 * Generates a matrix (2d array of strings) from the values of a a given input matrix. 
 * @param {HTMLElement} inputMatrix 
 * @returns {string[][]}
 */
function generateMatrix(inputMatrix, rows, columns) {
   let matrix = [];

   for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
         let entry = inputMatrix.childNodes[row * columns + col].value;
         entry = removeWhiteSpace(entry);

         if (inputIsValid(entry)) {
            matrix[row][col] = entry;
         } else {
            throw Error("invalid input");
         }
      }
   }
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

/**
 * Creates an object holding all the various inputs for a given matrix.
 * 
 * @param {string} matrixClass The unique class that of the matrix inputs.
 */
function findMatrixInput(matrixClass) {
   let MatrixInput = {};

   MatrixInput.row = {};
   MatrixInput.row.input = document.querySelector(`.${matrixClass} .row-in`);
   MatrixInput.row.plusBtn = document.querySelector(`.${matrixClass} .row .plus-btn`);
   MatrixInput.row.minusBtn = document.querySelector(`.${matrixClass} .row .minus-btn`);

   MatrixInput.col = {};
   MatrixInput.col.input = document.querySelector(`.${matrixClass} .col-in`);
   MatrixInput.col.plusBtn = document.querySelector(`.${matrixClass} .col .plus-btn`);
   MatrixInput.col.minusBtn = document.querySelector(`.${matrixClass} .col .minus-btn`);

   MatrixInput.resetBtn = document.querySelector(`.${matrixClass} .reset-btn`);
   MatrixInput.createBtn = document.querySelector(`.${matrixClass} .create-btn`);

   MatrixInput.matrix = document.querySelector(`.${matrixClass}.input-matrix`);
   MatrixInput.class = matrixClass;

   return MatrixInput;
}

