(function() {
    'use strict';

    var canvas = document.getElementById('field');
    var ctx = canvas.getContext('2d');

    const WIDTH = 600;
    const HEIGHT = 600;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    var Cell = function(cellType) {
        this.value = cellType; // L: live or D: dead
        this.row = null;
        this.col = null;
        this.color = "white";
    };

    Cell.prototype.setPos = function(row, col) {
        this.row = row;
        this.col = col;
    };

    Cell.prototype.getColor = function() {
        if (this.value == "D") {
            return "#fff";
        } else if (this.value == "L") {
            return "#000";
        } else {
            return "#ff0";
        }
    };

    Cell.prototype.getNeighbours = function() {
        let row = this.row;
        let col = this.col;

        return [[row-1,col-1], [row-1,col], [row-1,col+1],
                [row,col-1],                [row,col+1],
                [row+1,col-1], [row+1,col], [row+1,col+1]];
    };

    var Field = function() {
        this.content = [];
        let isRunning;
    };

    Field.prototype.initContents = function(length) {
        // content[0] and content[length] are sentinels.
        for (let i=0; i<=length; i++) {
            this.content.push([]);
            for (let j=0; j<=length; j++) {
                let cell = new Cell("D");
                cell.setPos(i, j);
                this.content[i].push(cell);
            }
        }
    };

    Field.prototype.genContents = function() {
        let numRows = this.content.length - 2;
        let numCols = this.content[0].length - 2;

        for (let row=1; row<numRows+1; row++) {
            for (let col=1; col<numCols+1; col++) {
                let cell = this.content[row][col];
                let r = Math.floor(Math.random() * 11);
                if (r > 8) {
                    cell.value = "L";
                }
            }
        }
    };

    Field.prototype.drawContents = function() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        let numRows = this.content.length - 2;
        let numCols = this.content[0].length - 2;

        let cellWidth = WIDTH / numCols;
        let cellHeight = HEIGHT / numRows;

        let cellLength = Math.max(cellWidth, cellHeight);
        for (let row=1; row<numRows+1; row++) {
            for (let col=1; col<numCols+1; col++) {
                let cell = this.content[row][col];
                let rectX = (col-1) * cellLength;
                let rectY = (row-1) * cellLength;
                ctx.fillStyle = "black"; // frame
                ctx.fillRect(rectX, rectY, cellLength, cellLength);

                ctx.fillStyle = cell.getColor();
                ctx.fillRect(rectX+1, rectY+1, cellLength-2, cellLength-2);
            }
        }
    };

    Field.prototype.nextGen = function() {
        let numRows = this.content.length - 2;
        let numCols = this.content[0].length - 2;
        for (let row=1; row<numRows+1; row++) {
            for (let col=1; col<numCols+1; col++) {
                let cell = this.content[row][col];
                let neighbours = cell.getNeighbours();
                let count = 0;
                for (let n of neighbours) {
                    let ncell = this.content[n[0]][n[1]];
                    if (ncell.value == "L") count++;
                }

                if (cell.value == "D") {
                    // birth
                    if (count == 3) {
                        cell.value = "L";
                    }
                } else if (cell.value == "L") {
                    if (count == 2 || count == 3) { // still alive
                    } else if (count <= 1) { // depopulation
                        cell.value = "D";
                    } else if (count >= 4) { // overcrowd
                        cell.value = "D";
                    }
                }
            }
        }
    };

    let size = document.getElementById('size');

    var myField;
    function generator() {
        myField = new Field();
        let genSize = size.value;
        myField.initContents(genSize);
        myField.genContents();
        myField.drawContents();
        myField.isRunning = false;
        return;
    }

    generator();

    let random = document.getElementById('random');
    random.addEventListener("click", function() {
        generator();
    });

    function onestep() {
        myField.nextGen();
        myField.drawContents();
        return;
    };
    let step = document.getElementById('step');
    step.addEventListener("click", function() {
        onestep();
    });

    function autoRun() {
        if (myField.isRunning) {
            onestep();
            setTimeout(autoRun, 1000);
        }
        return;
    };
    let run = document.getElementById('run');
    run.addEventListener("click", function() {
        if (myField.isRunning) {
            run.value = "RUN";
            myField.isRunning = false;
        } else {
            run.value = "STOP";
            myField.isRunning = true;
            autoRun();
        }
    });
}) ();
