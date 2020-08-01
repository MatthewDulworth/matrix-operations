/**
 * Holds the inputs for a dimension of an input matrix. 
 * Is either a row input or a column input. 
 * Contains behavior for the plus/minus buttons and the text input that holds the number of rows/columns.
 */
class DimensionInput {
   /**
    * Adds the event listeners to the buttons/input. 
    * @param {string} matrixClass The unique html class of the input matrix. 
    * @param {string} type "row" or "col".
    */
   constructor(matrixClass, type) {

      if (type !== "row" && type !== "col") {
         throw Error('Invalid Input, type must be either "row" or "col"');
      }

      this.input = document.querySelector(`.${matrixClass} .${type}-in`);
      this.plusBtn = document.querySelector(`.${matrixClass} .${type} .plus-btn`);
      this.minusBtn = document.querySelector(`.${matrixClass} .${type} .minus-btn`);

      if (this.input === null || this.plusBtn === null || this.minusBtn === null) {
         throw Error("Input Elements Are Null");
      }

      this.oldValue = this.validateInput();
      this.addIncrementButtonListeners();
      this.addFocusEventListener();
   }

   /**
    * Adds focus event to the input.
    * On focus selects the text content of the input.
    */
   addFocusEventListener() {
      this.input.addEventListener('focus', () => this.input.select());
   }

   /**
    * Adds click event listeners to the plus and minus buttons.
    * The plus button increments the input by 1, while the minus increments it by -1.
    */
   addIncrementButtonListeners() {
      this.plusBtn.addEventListener('click', () => this.incrementInput(1));
      this.minusBtn.addEventListener('click', () => this.incrementInput(-1));
   }

   /**
    * Increments the input value by the given amount then validates the input. 
    * @fires change Fires the change event on the this.input.
    * @param {number} increment The amount to increment by. 
    * @returns {number} Incremented, validated input value.
    */
   incrementInput(increment) {
      this.input.value = this.validateInput() + increment;
      triggerEvent(this.input, 'change');
      return this.validateInput();
   }

   /**
    * Attempts to parse the input value to an integer, if it cannot it sets the input to 0. 
    * Constrains the input value to an integer between 0 and the html max.
    * Updates the input value html to the validated input.
    * @returns {number} An integer between 0 and max.
    */
   validateInput() {
      let val = parseInt(this.input.value);

      if (isNaN(val)) {
         val = 0;
      } else {
         val = Math.max(val, 0);
         val = Math.min(val, this.input.max);
      }
      this.input.value = val;
      return val;
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

      if (this.resetBtn === null || this.createBtn === null || this.matrix === null) {
         throw Error("Input Elements Are Null")
      }

      this.row = new DimensionInput(matrixClass, "row");
      this.col = new DimensionInput(matrixClass, "col");

      this.initMatrix();
      this.addResetButtonListener();
      this.addRowColChangeListeners();
   }

   // -----------------------------------------------------------
   // Add Event Listeners
   // -----------------------------------------------------------
   /**
    * Adds a click event listener to the reset button.
    * On click sets the value to every entry in the input matrix to a blank string.
    */
   addResetButtonListener() {
      this.resetBtn.addEventListener('click', () => this.entries().forEach(entry => entry.value = ""));
   }

   /**
    * 
    */
   addRowColChangeListeners() {
      this.row.input.addEventListener('change', () => this.handleRowChanges());
      this.col.input.addEventListener('change', () => this.handleColChanges());
   }


   // -----------------------------------------------------------
   // Handle Row Changes
   // -----------------------------------------------------------
   /**
    * Adds or removes rows as needed based on input.
    */
   handleRowChanges() {
      const rows = this.rows();
      const columns = this.columns();
      const oldRows = this.row.oldValue;
      const rowsToAdd = rows - oldRows;

      if (rowsToAdd > 0) {
         this.addRows(rowsToAdd, oldRows, columns);
         this.setMatrixGridRows(this.rows());
      } else if (rowsToAdd < 0) {
         this.removeRows(-rowsToAdd, columns);
         this.setMatrixGridRows(this.rows());
      }

      this.row.oldValue = rows;
   }

   /**
    * Adds the specified number of rows to the matrix input grid.
    * @param {number} rowsToAdd The number of rows to add.
    * @param {number} oldRows The the current (soon to be old) number of rows.
    * @param {number} columns The current number of columns.
    */
   addRows(rowsToAdd, oldRows, columns) {
      for (let i = 0; i < rowsToAdd; i++) {
         let currentRow = oldRows + i;
         for (let col = 0; col < columns; col++) {
            this.matrix.appendChild(this.createMatrixEntry(currentRow, col));
         }
      }
   }

   /**
    * Removes the specified number of rows from the matrix input grid. 
    * @param {number} rowsToRemove The number of rows to remove.
    * @param {number} columns The current number of columns. 
    */
   removeRows(rowsToRemove, columns) {
      for (let i = 0; i < rowsToRemove; i++) {
         for (let col = 0; col < columns; col++) {
            this.matrix.removeChild(this.matrix.lastChild);
         }
      }
   }


   // -----------------------------------------------------------
   // Handle Column Changes
   // -----------------------------------------------------------
   /**
    * Adds or removes columns as needed based on input.
    */
   handleColChanges() {
      const rows = this.rows();
      const columns = this.columns();
      const oldColumns = this.col.oldValue;
      const colsToAdd = columns - oldColumns;

      if (colsToAdd > 0) {
         this.addColumns(colsToAdd, oldColumns, rows);
         this.setMatrixGridCols(this.columns());
      } else if (colsToAdd < 0) {
         this.removeColumns(-colsToAdd, oldColumns, rows);
         this.setMatrixGridCols(this.columns());
      }

      this.col.oldValue = columns;
   }

   /**
    * Adds the specified number of rows to the matrix input grid.
    * @param {number} colsToAdd The number of rows to add.
    * @param {number} oldColumns The the current (soon to be old) number of rows.
    * @param {number} rows The current number of rows.
    */
   addColumns(colsToAdd, oldColumns, rows) {

      for (let i = 0; i < colsToAdd; i++) {
         let offset = 0;
         for (let row = 0; row < rows; row++) {
            let entry = this.createMatrixEntry(row, oldColumns);
            let before = this.entries()[oldColumns * row + oldColumns + offset];
            this.matrix.insertBefore(entry, before);
            offset++;
         }
         oldColumns++;
      }
   }

   removeColumns(colsToRemove, columns, rows) {
      console.log(`remove: ${colsToRemove} cols: ${columns} rows: ${rows}`);
      columns = columns - 1;
      let entries = [];

      for (let i = 0; i < colsToRemove; i++) {
         for (let row = rows - 1; row >= 0; row--) {
            let entry = this.entry(row, columns);
            entries.push(entry);
         }
         columns--;
      }
      entries.forEach(col => col.remove());
   }


   // -----------------------------------------------------------
   // Setup
   // -----------------------------------------------------------
   /**
    * Generates the initial entries for the input matrix. 
    */
   initMatrix() {
      const rows = this.rows();
      const columns = this.columns();

      for (let row = 0; row < rows; row++) {
         for (let col = 0; col < columns; col++) {
            this.matrix.appendChild(this.createMatrixEntry(row, col, this.class));
         }
      }

      this.setMatrixGridRows(rows);
      this.setMatrixGridCols(columns);
   }


   // -----------------------------------------------------------
   // Create Matrix Entry
   // -----------------------------------------------------------
   /**
    * Creates a text input for the entry of the matrix.
    * Adds an event listener for the focus event to each entry. Selects the input on focus. 
    * @param {number} row The row of the entry.
    * @param {number} column The column of the entry. 
    * @returns {HTMLElement} The text input that is the entry.
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
   // Helper Functions
   // -----------------------------------------------------------
   /**
    * Sets grid-template-rows  and for the matrix entries grid. 
    * @param {number} rows 
    */
   setMatrixGridRows(rows) {
      this.matrix.style.setProperty('grid-template-rows', `repeat(${rows}, auto)`);
   }

   /**
    * Sets the grid-template-columns for the matrix entries grid.
    * @param {number} columns 
    */
   setMatrixGridCols(columns) {
      this.matrix.style.setProperty('grid-template-columns', `repeat(${columns}, auto)`);
   }


   // -----------------------------------------------------------
   // Getters
   // -----------------------------------------------------------

   /**
    * @returns {number} The number of rows the matrix has. 
    */
   rows() {
      return parseInt(this.row.validateInput());
   }

   /**
    * @returns {number} The number of columns the matrix has. 
    */
   columns() {
      return parseInt(this.col.validateInput());
   }

   /**
    * @returns {NodeList} The entries in the matrix. 
    */
   entries() {
      return this.matrix.childNodes;
   }

   /**
    * @param {number} row The row of the entry.
    * @param {number} column The column of the entry.
    * @returns {string} The value of the entry at 
    */
   entry(row, column) {
      const index = row * this.col.oldValue + column;

      if (index < 0 || index >= this.matrix.childNodes.length) {
         throw Error("Invalid Index");
      } else {
         return this.matrix.childNodes[index];
      }
   }
}

// 
/**
 * Triggers the given event on the given element.
 * Adapted from https://plainjs.com/javascript/events/trigger-an-event-11/.
 * @param {HTMLElement} element The element to trigger the event on. 
 * @param {string} eventType The type of event to trigger.
 */
function triggerEvent(element, eventType) {
   if ('createEvent' in document) {
      // modern browsers, IE9+
      var e = document.createEvent('HTMLEvents');
      e.initEvent(eventType, false, true);
      element.dispatchEvent(e);
   } else {
      // IE 8
      var e = document.createEventObject();
      e.eventType = eventType;
      element.fireEvent('on' + e.eventType, e);
   }
}
