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

      this.input = document.getElementById("input");
      this.operations = document.getElementById("operations");
      this.display = document.getElementById("display");

      this.addBtn = document.querySelector("#add button");
      this.subtractBtn = document.querySelector("#subtract button");
      this.multiplyBtn = document.querySelector("#multiply button");
      this.scaleBtn = document.querySelector("#scale button");

      this.transposeBtn = document.querySelector("#transpose button");
      this.inverseBtn = document.querySelector("#inverse button");

      // check for null elements
      for (let field in this) {
         if (this[field] === null) {
            throw Error("Error: element " + field + " is null");
         }
      }

      this.addBtn.addEventListener('click', () => this.handleAddition());
      this.subtractBtn.addEventListener('click', () => this.handleSubtraction());
      this.multiplyBtn.addEventListener('click', () => this.handleMultiplication());
      this.scaleBtn.addEventListener('click', () => this.handleScaling());

      this.transposeBtn.addEventListener('click', () => this.handleTranspose());
      this.inverseBtn.addEventListener('click', () => this.handleInverse());

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


   // ---------------------------------------------------------------------------
   // Display
   // ---------------------------------------------------------------------------
   /**
    * Displays the passed arguments in the display element.
    * Formats matrices, displays everything in the order passed.
    * @throws Error if args contains any elements that are neither matrices nor strings.
    * @param  {...any} args Pass either matrices or strings 
    */
   displayResults(...args) {
      const resultsDisplay = document.createElement("div");
      resultsDisplay.classList.add("results-display");

      args.forEach(arg => {
         let element;
         if (arg instanceof Matrix) {
            element = this.createDisplayMatrix(arg.toString());
         } else if (typeof arg === "string") {
            element = document.createElement("div");
            element.innerHTML = arg;
         } else {
            throw Error("Results must either be strings or matrices");
         }
         resultsDisplay.appendChild(element);
      });
      this.display.prepend(resultsDisplay);
   }

   /**
    * @param {String[][]} matrix The matrix to display.
    * @returns {HTMLElement} An html element to display the passed matrix array.
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
   // Inverse Operation Handlers
   // ---------------------------------------------------------------------------
   /**
    * Computes and displays the transpose of a matrix.
    */
   handleTranspose() {
      const matrix = this.getMatrices(this.getSelectValue("transpose"));
      if (matrix !== null) {
         const transpose = matrix.transpose();
         this.displayResults("Transpose", matrix, "=", transpose);
      }
   }

   /**
    * Computes and displays the inverse of a matrix.
    */
   handleInverse() {
      const matrix = this.getMatrices(this.getSelectValue("inverse"));
      if (matrix !== null) {
         const inverse = matrix.inverse().last();
         if (inverse.equals(matrix)) {
            this.displayResults("Inverse", matrix, "=", "This matrix is not invertible.");
         } else {
            this.displayResults("Inverse", matrix, "=", inverse);
         }
      }
   }

   
   // ---------------------------------------------------------------------------
   // Basic Operation Handlers
   // ---------------------------------------------------------------------------
   /**
    * Computes and displays a matrix addition.
    * Alerts the user if rows and columns of matrices do not match.
    */
   handleAddition() {
      const left = this.getSelectValue("add", 1);
      const right = this.getSelectValue("add", 2);
      const matrices = this.getMatrices(left, right);

      if (matrices !== null) {
         try {
            const sum = matrices[0].matrixAddition(matrices[1], true);
            this.displayResults(matrices[0], "+", matrices[1], "=", sum);
         } catch (error) {
            alert("Rows and columns of the matrices must match.");
         }
      }
   }

   /**
    * Computes and displays a matrix subtraction.
    * Alerts the user if rows and columns of matrices do not match.
    */
   handleSubtraction() {
      const left = this.getSelectValue("subtract", 1);
      const right = this.getSelectValue("subtract", 2);
      const matrices = this.getMatrices(left, right);

      if (matrices !== null) {
         try {
            const difference = matrices[0].matrixAddition(matrices[1], false);
            this.displayResults(matrices[0], "-", matrices[1], "=", difference);
         } catch (error) {
            alert("Rows and columns of the matrices must match.");
         }
      }
   }

   /**
    * Computes and displays a matrix multiplication.
    * Alerts the user if rows and columns of matrices do not match.
    */
   handleMultiplication() {
      const left = this.getSelectValue("multiply", 1);
      const right = this.getSelectValue("multiply", 2);
      const matrices = this.getMatrices(left, right);

      if (matrices !== null) {
         try {
            const product = matrices[0].matrixMultiplication(matrices[1]);
            this.displayResults(matrices[0], "x", matrices[1], "=", product);
         } catch (error) {
            alert("The rows of the first matrix must match the columns of the second matrix.");
         }
      }
   }

   /**
    * Computes and displays a matrix scalar multiplication.
    */
   handleScaling() {
      const matrix = this.getMatrices(this.getSelectValue("scale"));
      const scalar = document.querySelector("#scale input[type='text']").value;

      if (matrix !== null) {
         const product = matrix.scalarMultiplication(parseInt(scalar));
         this.displayResults(matrix, "x", scalar, "=", product);
      }
   }


   // ---------------------------------------------------------------------------
   // Get Input
   // ---------------------------------------------------------------------------
   /**
    * @param {string} id The id of the operation. 
    * @param {number} index The index of the matrix select
    * @returns {number} Integer value of the specified matrix select. 
    */
   getSelectValue(id, index = 1) {
      return parseInt(document.querySelector(`#${id} .matrix-select:nth-of-type(${index})`).value);
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
    * Alerts the user if any of the specified matrix inputs have invalid values.
    * @returns {Matrix[]|Matrix|null} If possible returns new matrices from the specified matrix inputs, otherwise returns null. 
    */
   getMatrices(...indices) {
      try {
         const matrices = [];
         indices.forEach((matrixIndex, i) => matrices[i] = this.getMatrixFromInput(matrixIndex));

         if (matrices.length === 1) {
            return matrices[0];
         } else {
            return matrices;
         }
      } catch (error) {
         alert("Please make sure your matrix input is limited to fractions or decimal numbers.");
         return null;
      }
   }
}

const matrixOps = new MatrixOpsCalculator();