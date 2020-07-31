class DimensionInput {
   /**
    * @param {string} matrixClass 
    * @param {string} type
    */
   constructor(matrixClass, type) {
      this.input = document.querySelector(`.${matrixClass} .${type}-in`);
      this.plusBtn = document.querySelector(`.${matrixClass} .${type} .plus-btn`);
      this.minusBtn = document.querySelector(`.${matrixClass} .${type} .minus-btn`);
   }
}


class MatrixInput {
   /**
    * @param {string} matrixClass 
    */
   constructor(matrixClass) {
      this.class = matrixClass;
      this.resetBtn = document.querySelector(`.${matrixClass} .reset-btn`);
      this.createBtn = document.querySelector(`.${matrixClass} .create-btn`);
      this.matrix = document.querySelector(`.${matrixClass}.input-matrix`);

      this.row = new DimensionInput(matrixClass, "row");
      this.col = new DimensionInput(matrixClass, "col");
   }

   rows() {
      return this.row.input.value;
   }

   columns() {
      return this.col.input.value;
   }
}

