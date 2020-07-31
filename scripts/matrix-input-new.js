
/**
 * Holds the inputs for a dimension of an input matrix. 
 * Is either a row input or a column input. 
 * Contains behavior for the plus/minus buttons and the text input that holds the number of rows/columns.
 */
class DimensionInput {
   /**
    * Adds the event listeners to the buttons/input. 
    * @param {string} matrixClass The unique html class of the input matrix. 
    * @param {string} type row or col.
    */
   constructor(matrixClass, type) {
      this.input = document.querySelector(`.${matrixClass} .${type}-in`);
      this.plusBtn = document.querySelector(`.${matrixClass} .${type} .plus-btn`);
      this.minusBtn = document.querySelector(`.${matrixClass} .${type} .minus-btn`);
      this.oldValue = this.input.value;
   }
}

/**
 * Represents inputs for a matrix.
 * Holds the row inputs, column inputs, matrix entry inputs, and reset and create buttons.
 * Holds behaviour for them as well. 
 */
class MatrixInput {

   /**
    * Generates an initial input matrix and adds the event listeners to the buttons. 
    * @param {string} matrixClass The unique html class of the input matrix.
    */
   constructor(matrixClass) {
      this.class = matrixClass;
      this.resetBtn = document.querySelector(`.${matrixClass} .reset-btn`);
      this.createBtn = document.querySelector(`.${matrixClass} .create-btn`);
      this.matrix = document.querySelector(`.${matrixClass}.input-matrix`);

      this.row = new DimensionInput(matrixClass, "row");
      this.col = new DimensionInput(matrixClass, "col");

      this.initMatrix();
   }


   // -----------------------------------------------------------
   // Create Matrix
   // -----------------------------------------------------------

   /**
    * Generates the initial entries for the input matrix. 
    */
   initMatrix() {
      this.matrix.innerHTML = "";

      for (let row = 0; row < this.rows(); row++) {
         for (let col = 0; col < this.columns(); col++) {
            this.matrix.appendChild(this.createMatrixEntry(row, col, this.class));
         }
      }

      this.matrix.style.setProperty('grid-template-rows', `repeat(${this.rows()}, auto)`);
      this.matrix.style.setProperty('grid-template-columns', `repeat(${this.columns()}, auto)`);
   }

   /**
    * Creates a text input for the entry of the matrix.
    * @event focus Selects its content on focus.
    * @param {number} row The row of the entry.
    * @param {number} column The column of the entry. 
    * @returns {HTMLElement} The entry.
    */
   createMatrixEntry(row, column) {
      let entrySpace = document.createElement('input');
      entrySpace.type = 'text';

      entrySpace.classList.add("entry");
      entrySpace.classList.add(`${this.class}_${row}_${column}`);

      entrySpace.addEventListener("focus", () => entrySpace.select());
      return entrySpace;
   }


   // -----------------------------------------------------------
   // Getters
   // -----------------------------------------------------------

   /**
    * @returns The number of rows the matrix has. 
    */
   rows() {
      return this.row.input.value;
   }

   /**
    * @returns The number of columns the matrix has. 
    */
   columns() {
      return this.col.input.value;
   }
}