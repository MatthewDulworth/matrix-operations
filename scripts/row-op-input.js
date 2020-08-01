'use strict';

// -----------------------------------------------------------
// Constants
// -----------------------------------------------------------
/**@type {MatrixInput} */
const matrixInput = new MatrixInput("_0");
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