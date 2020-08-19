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
      this.matrixSelects = document.querySelectorAll(".matrix-select");

      // setup methods
      this.setMatrixSelectValues();
   }

   setMatrixSelectValues() {
      // generate the matrix names based on the number of matrix inputs, e.g. A, B, C...
      const names = this.matrixInputs.map((_, i) => String.fromCharCode('A'.charCodeAt(0) + i));
      
      this.matrixSelects.forEach(select => {
         let options = "";
         names.forEach((name, i) => options += `<option value=${i}>${name}</option>`);
         select.innerHTML = options;
      });
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