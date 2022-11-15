# Sudoku Generator in JavaScript
A generator for solvable Sudokus using Wave Function Collapse principles.

## How do I build this?
```
npm install
npm run build
```

## Usage
```
node . [N]
```

N is the number of fields that should remaing unsolved. A value of 0 solves the entire field.

## How does it work?
The generator relies on the same principles behind Wave Function Collapse, though it was optimized according to the rules of Sudoku. With a little extra work it could even support abnormal cell groupings, as seen on harder ("impossible") Sudokus. As a step by step:

1. Generate 3*N `Set`s containing all possible numbers for a Row, Column and Group.
2. Generate an `Array` of N*N `Cell`s and assign them a `Set` for Row, Column and Group generated in Step 1.
3. While we still have unsolved `Cell`s:  
    1. Randomize the `Array` of unsolved `Cell`s fairly.
    2. Pick a `Cell` with the lowest available options.
    3. Collapse the chosen `Cell`.
    4. Remove the chosen `Cell` from the remaining unsolved `Cell`s.
4. Done!

## Known Problems
- Sometimes it needs more than one cycle to generate a field, which is most likely due to the naive collapse() function.
    - Perhaps this may be solvable with validated solving to ensure that the chosen value will not eliminate all possible solutions from another Row, Column or Group.
