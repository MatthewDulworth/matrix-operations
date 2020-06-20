/**
 * Holds a sequence of matrix operations and their resulting matrices. 
 */
class StepList {
   private matrices: Matrix[];
   private instructions: string[];
   private length: number;

   /**
    * Creates a new steplist. 
    * 
    * @param matrix The original matrix of the operation. 
    */
   constructor(matrix: Matrix) {
      this.matrices = [];
      this.instructions = [];
      this.length = 0;
      this.addStep(matrix, "Original matrix.");
   }

   /**
    * Adds a new operation to the sequence. 
    * 
    * @param matrix The result of a matrix/row operation. 
    * @param instruction The specific operation. 
    */
   public addStep(matrix: Matrix, instruction: string) {
      this.matrices.push(matrix);
      this.instructions.push(instruction);
      this.length++;
   }

   /**
    * @returns The last matrix in the step list. 
    */
   public last() {
      return this.matrices[this.length - 1];
   }

   /**
    * Displays sequence of steps. 
    */
   public log() {
      for (let i = 0; i < this.length; i++) {
         console.log(this.instructions[i]);
         console.table(this.matrices[i].array);
      }
   }

   /**
    * Displays the original and final matrices. 
    */
   public logShort() {
      console.log("Original.");
      console.table(this.matrices[0].array);
      console.log("Final");
      console.table(this.last().array);
   }
}