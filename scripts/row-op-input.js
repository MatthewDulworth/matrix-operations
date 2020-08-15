'use strict';

const matrixInput = new MatrixInput("A");

/**
 * When the create button is clicked try to generate a string matrix from the matrix input.
 * If so, store it in sessions storage and go to the next page.
 * If not, alert the user that their input is invalid.
 */
document.getElementById("create-btn").addEventListener('click', () => {
   try {
      createMatrix();
   } catch (error) {
      alert("Please make sure your matrix input is limited to fractions or decimal numbers.");
   }
});

/**
 * @throws Invalid Input if any matrix element contains invalid input
 */
function createMatrix() {
   const matrix = matrixInput.toArray();
   sessionStorage.setItem(matrixInput.ID, JSON.stringify(matrix));
   window.location.href = '../html/row-op.html';
}