"use strict";

/**
 * A class to hold all the steps of a long matrix operation. 
 */
class StepList {

   /**
    * Creates a new steplist.
    * @param {Matrix} matrix 
    */
   constructor(matrix) {
      this.matrices = [];
      this.instructions = [];
      this.length = 0;
      this.addStep(matrix, "Original matrix.");
   }

   /**
    * Add a new step to the list. 
    * @param {Matrix} matrix 
    * @param {string} instruction 
    */
   addStep(matrix, instruction) {
      this.matrices.push(matrix);
      this.instructions.push(instruction);
      this.length++;
   }

   /**
    * Returns the last matrix in the list.
    * @returns {Matrix}
    */
   last() {
      return this.matrices[this.length - 1];
   }

   /**
    * Outputs all the steps to the console.
    */
   log() {
      for (let i = 0; i < this.length; i++) {
         console.log(`Operation Number ${i}: ${this.instructions[i]}`);


         this.matrices[i].log();
      }
   }

   /**
    * Displays the original and final matrices on the console.
    */
   logShort() {
      console.log("Original.");
      this.matrices[0].log();
      console.log("Final");
      this.last().log();
   }
}
