'use strict';

// -----------------------------------------------------------
// Constants
// -----------------------------------------------------------
/**@type {MatrixInput} */
const matrixInput = new MatrixInput("_0");; 

/**@type {string[][]} */
let matrix = [];

matrixInput.createBtn.addEventListener('click', () => {
   try {
      matrix = matrixInput.toArray();
      console.log(matrix);
   } catch (error) {
      console.log("fail");
   }
});