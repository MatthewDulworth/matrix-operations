// class StepList {
//    private matrices: Matrix[];
//    private instructions: string[];
//    private length: number;

//    constructor(matrix: Matrix) {
//       this.matrices = [];
//       this.instructions = [];
//       this.length = 0;
//       this.addStep(matrix, "Original matrix.");
//    }

//    public addStep(matrix: Matrix, instruction: string) {
//       this.matrices.push(matrix);
//       this.instructions.push(instruction);
//       this.length++;
//    }

//    public last() {
//       return this.matrices[this.length - 1];
//    }

//    public log() {
//       for (let i = 0; i < this.length; i++) {
//          console.log(this.instructions[i]);
//          console.table(this.matrices[i].array);
//       }
//    }
// }