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

      this.addBtn.addEventListener('click', () => this.handleAddition());
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
    * Creates a matrix from the values of the specified matrixInput. 
    * @throws Error if the matrix input has invalid input.
    * @param {number} index The index of the MatrixInput.
    * @returns
    */
   getMatrixFromInput(index) {
      const array = this.matrixInputs[index].toArray();
      return new Matrix(array.length, array[0].length, array);
   }

   /**
    * @param {number} left 
    * @param {number} right 
    * @returns {Matrix | null}
    */
   getMatrices(left, right) {
      try {
         const leftMatrix = this.getMatrixFromInput(left);
         const rightMatrix = this.getMatrixFromInput(right);
         return [leftMatrix, rightMatrix];
      } catch (error) {
         alert("Please make sure your matrix input is limited to fractions or decimal numbers.");
         return null;
      }
   }

   displayResult(matrices, opSymbol, result) {
      matrices[0] = this.createDisplayMatrix(matrices[0]);
      matrices[1] = this.createDisplayMatrix(matrices[1]);
      result = this.createDisplayMatrix(result);

      const symbol = document.createElement("div");
      symbol.innerHTML = opSymbol;

      const equals = document.createElement("div");
      equals.innerHTML = "=";

      const resultsDisplay = document.createElement("div");
      resultsDisplay.classList.add("results-display");
      resultsDisplay.appendChild(matrices[0]);
      resultsDisplay.appendChild(symbol);
      resultsDisplay.appendChild(matrices[1]);
      resultsDisplay.appendChild(equals);
      resultsDisplay.appendChild(result);
      document.getElementById("display").prepend(resultsDisplay);
   }

   /**
    * 
    * @param {String[][]} matrix 
    */
   createDisplayMatrix(matrix) {
      const displayMatrix = document.createElement('div');
      displayMatrix.classList.add("display-matrix");

      const rows = matrix.length;
      const columns = matrix[0].length;

      for (let row = 0; row < rows; row++) {
         for (let col = 0; col < columns; col++) {

            let entry = document.createElement('div');
            entry.textContent = matrix[row][col];
            displayMatrix.appendChild(entry);
         }
      }

      displayMatrix.style.setProperty('grid-template-rows', `repeat(${rows}, auto)`);
      displayMatrix.style.setProperty('grid-template-columns', `repeat(${columns}, auto)`);
      return displayMatrix;
   }

   // ---------------------------------------------------------------------------
   // Operation Handlers
   // ---------------------------------------------------------------------------
   /**
    * Handles matrix addition.
    */
   handleAddition() {
      const left = document.querySelector("#add .matrix-select").value;
      const right = document.querySelector("#add .matrix-select:nth-of-type(2)").value;
      const matrices = this.getMatrices(left, right);
      
      if(matrices !== null) {
         const sum = matrices[0].matrixAddition(matrices[1], true);
         this.displayResult(matrices.map(m => m.toString()), "+", sum.toString());
      }
   }

   handleSubtraction() { }
   handleMultiplication() { }
   handleScaling() { }
}

const matrixOps = new MatrixOpsCalculator();