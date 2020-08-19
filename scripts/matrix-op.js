"use strict"

/**
 * Models a matrix operations calculator.
 */
class MatrixOpsCalculator {
   /**
    * Finds all the html elements the calculator depends on. 
    * Adds event listeners to the proper html elements. 
    * Sets matrix inputs and matrix selects.
    * @throws Null pointer error, if it any of its this fields are null.
    */
   constructor() {
      this.matrixInputs = this.initMatrixInputs();
      this.matrixSelects = document.querySelectorAll(".matrix-select");
      this.matrices = [];

      this.addBtn = document.querySelector("#add button");
      this.subtractBtn = document.querySelector("#subtract button");
      this.multiplyBtn = document.querySelector("#multiply button");
      this.scaleBtn = document.querySelector("#scale button");

      // check for null elements
      for (let field in this) {
         if (this[field] === null) {
            throw Error("Error: element " + field + " is null");
         }
      }

      this.addBtn.addEventListener('click', () => handleAddition());
      this.subtractBtn.addEventListener('click', () => handleSubtraction());
      this.multiplyBtn.addEventListener('click', () => handleMultiplication());
      this.scaleBtn.addEventListener('click', () => handleScaling());

      // setup methods
      this.setMatrixSelectValues();
   }


   // ---------------------------------------------------------------------------
   // Setup
   // ---------------------------------------------------------------------------

   /**
    * Generates the list of matrix names for each matrix select based on the current matrix inputs.
    */
   setMatrixSelectValues() {
      // generate the matrix names based on the number of matrix inputs, e.g. A, B, C...
      const names = this.matrixInputs.map((_, i) => String.fromCharCode('A'.charCodeAt(0) + i));
      let options = "";
      names.forEach((name, i) => options += `<option value=${i}>${name}</option>`);
      this.matrixSelects.forEach(select => select.innerHTML = options);
   }

   /**
    * @returns Creates objects of MatrixInput for each matrixInput html element.
    */
   initMatrixInputs() {
      const matrixInputs = [];
      document.querySelectorAll(".matrix-input").forEach(matrixInput => matrixInputs.push(new MatrixInput(matrixInput.id)));
      return matrixInputs;
   }

   /**
    * Attempts to create a matrix from the values of the specified matrixInput. 
    * Alerts the user if they have invalid input.
    * @param {number} index The index of the MatrixInput.
    */
   storeMatrixFromInput(index) {
      try {
         const array = this.matrixInputs[index].toArray();
         this.matrices[index] = new Matrix(array.length, array[0].length, array);
      } catch (error) {
         alert("Please make sure your matrix input is limited to fractions or decimal numbers.");
      }
   }

   // ---------------------------------------------------------------------------
   // Operation Handlers
   // ---------------------------------------------------------------------------
   handleAddition() { }
   handleSubtraction() { }
   handleMultiplication() { }
   handleScaling() { }
}

const matrixOps = new MatrixOpsCalculator();