"use strict"

/**
 * Models a matrix operations calculator.
 */
class MatrixOpsCalculator {
   /**
    * 
    */
   constructor() {
      this.matrixInputs = this.initMatrices();
   }

   /**
    * @returns 
    */
   initMatrices() {
      const matrixInputs = [];
      document.querySelectorAll(".matrix-input").forEach(matrixInput => matrixInputs.push(new MatrixInput(matrixInput.id)));
      return matrixInputs;
   }
}

const matrixOps = new MatrixOpsCalculator();