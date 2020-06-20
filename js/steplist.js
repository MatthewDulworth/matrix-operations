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
            console.table(this.matrices[i].array);
        }
    }
    logShort() {
        console.log("Original.");
        console.table(this.matrices[0].array);
        console.log("Final");
        console.table(this.last().array);
    }
}
