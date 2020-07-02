"use strict";
class StepList {
   constructor(matrix) {
      this.matrices = [];
      this.instructions = [];
      this.length = 0;
      this.addStep(matrix, "Original matrix.");
   }
   addStep(matrix, instruction) {
      this.matrices.push(matrix);
      this.instructions.push(instruction);
      this.length++;
   }
   last() {
      return this.matrices[this.length - 1];
   }
   log() {
      for (let i = 0; i < this.length; i++) {
         console.log(this.instructions[i]);
         this.matrices[i].log();
      }
   }
   logShort() {
      console.log("Original.");
      this.matrices[0].log();
      console.log("Final");
      this.last().log();
   }
}
