"use strict";

/**
 * A class to hold all the steps of a long matrix operation. 
 */
class StepList {

   /**
    * Creates a new steplist.
    * @param {Matrix} matrix The first matrix in the list. Optional.
    */
   constructor(matrix) {
      this.matrices = [];
      this.instructions = [];
      this.targetRows = [];
      this.actorRows = [];
      this.length = 0;

      if (matrix !== undefined) {
         this.addStep(matrix, "Original matrix.", null, null);
      }
   }

   /**
    * Add a new step to the list. 
    * @param {Matrix} matrix 
    * @param {string} instruction 
    */
   addStep(matrix, instruction, targetRow, actorRow) {
      this.matrices.push(matrix);
      this.instructions.push(instruction);
      this.targetRows.push(targetRow);
      this.actorRows.push(actorRow);
      this.length++;
   }

   range(start, end) {
      let steps = new StepList();
      
      for(let index = start; index <= end; index++){
         steps.addStep(this.matrices[index], this.instructions[index], this.targetRows[index], this.actorRows[index]);
      }

      return steps;
   }

   /**
    * @returns {Matrix} The most recently added matrix.
    */
   last() {
      try {
         return this.matrices[this.length - 1];
      } catch (e) {
         return null;
      }
   }

   /**
    * @returns {Matrix} The next to last matrix in the list.
    */
   nextToLast() {
      try {
         return this.matrices[this.length - 2];
      } catch (e) {
         return null;
      }
   }

   /**
    * @returns {string} The most recently added instruction.
    */
   lastMsg() {
      try {
         return this.instructions[this.length - 1];
      } catch (e) {
         return null;
      }
   }

   /**
    * Outputs all the steps to the console.
    */
   log() {
      for (let i = 0; i < this.length; i++) {
         console.log(`Operation Number ${i}: ${this.instructions[i]}`);
         console.log(`Operation on row ${this.targetRows[i]}`);
         this.matrices[i].log();
      }
   }

   /**
    * Displays the original and final matrices on the console.
    */
   logShort() {
      console.log("Original.");
      this.matrices[0].log();
      console.log("Final.");
      this.logLast();
   }

   /**
    * Displays the last final matrix in the list.
    */
   logLast() {
      console.log(this.instructions[this.length - 1]);
      console.log(`Operation on row ${this.targetRows[this.length - 1]}`);
      this.last().log();
   }
}
