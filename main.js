
let A = [
   [1,2,3],
   [4,5,6],
   [7,8,9]
];

let m = new Matrix(3,3, A);

m.log();
m.rowMultiplication(1, 10);
m.log();