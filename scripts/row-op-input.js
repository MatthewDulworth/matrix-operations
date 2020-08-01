'use strict';

// -----------------------------------------------------------
// Constants
// -----------------------------------------------------------
const matrixInput = new MatrixInput("_0");

// -----------------------------------------------------------
// Create Button Listener
// -----------------------------------------------------------
/**
 * When the create button is clicked try to generate a string matrix from the matrix input.
 * If so, store it in sessions storage and go to the next page.
 * If not, alert the user that their input is invalid.
 */
matrixInput.createBtn.addEventListener('click', () => {

   let success = true;
   let matrix;

   try {
      matrix = matrixInput.toArray();
   } catch (error) {
      success = false;
      alert("Please make sure your matrix input is limited to fractions or decimal numbers.");
   }

   if (success) {
      sessionStorage.setItem(matrixInput.ID, JSON.stringify(matrix));
      window.location.href = '../html/row-op.html';
   }
});