const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const CELL_SIZE = 60;
var startBttn = document.getElementById("startButton");
var clearBttn = document.getElementById("clearButton");

var width = 20;
canvas.width = width * CELL_SIZE;
canvas.height = width * CELL_SIZE;
var WALLS=[];

class Cell {
    constructor(x, y, wall = false) {
        this.x = x;
        this.y = y;
        this.isWall = wall;
        this.isPath = false;
        this.isStart = false;
        this.isTarget = false;
        this.parent = null;
        this.g = 0; // стоимость пути от начальной клетки до любой другой 
        this.h = 0; // эвристическое приближение соимости пути от клетки n до конечной 
        this.f = 0; // длина пути до цели 
    }
    // вычисляем эвристическую оценку расстояния до цели
    heuristic(targetCell) {
        return (Math.abs(this.x - targetCell.x) + Math.abs(this.y - targetCell.y));
    }
}

function createField(width) { //создаем матрицу в которой каждая ячейка - клетка
    let field = new Array(width);
    for (let i = 0; i < width; i++) {
        field[i] = new Array(width);
        for (let j = 0; j < width; j++) {
            field[i][j] = new Cell(i, j);
        }
    }
    return field;
}
//добавляем стены на нашей карте
function addObstacles(field, walls) {
    for (let i = 0; i < walls.length; i++) {
        let [row, col] = walls[i];
        field[row][col].isWall = true;
    }
}
function addWall(wall){
    drawCell(wall);
    return WALLS.push(wall);
}
function AStarAlgorithm(startCell, targetCell, field) {
    let openList = [startCell];
    let closedList = [];
    // пока есть клетки для исследования
    while (openList.length > 0) {
        // находим клетку с наименьшей оценкой f
        let currentCell = openList[0];
        let currentIndex = 0;
        for (let i = 0; i < openList.length; i++) {
            if (openList[i].f < currentCell.f) {
                currentCell = openList[i];
                currentIndex = i;
            }
        }
        //  удаляем текущую клетку из открытого списка и добавляем в список посещенных
        openList.splice(currentIndex, 1);
        closedList.push(currentCell);
        // если текущая клетка является целевой, то мы нашли путь
        if (currentCell == targetCell) {
            let path = [];
            let current = currentCell;
            while (current) {
                path.push(current);
                current = current.parent;
            }
            return path.reverse();
        }
        let neighbors = [];
        let x = currentCell.x;
        let y = currentCell.y;
        if (x > 0) neighbors.push(field[x - 1][y]); //сверху
        if (x < field.length - 1) neighbors.push(field[x + 1][y]);//снизу
        if (y > 0) neighbors.push(field[x][y - 1]);//слева
        if (y < field[0].length - 1) neighbors.push(field[x][y + 1]);//справа
        // соедние клетки
        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];
            // пропускаем соседние клетки которые уже находятся в списке посещенных или являются стенками
            if (closedList.includes(neighbor) || neighbor.isWall) {
                continue;
            }

            // вычисляем новое значение g для соседней клетки
            let newG = currentCell.g + 1;

            // если новый путь к соседнему узлу лучше, то обновляем значения f, g и родителя
            if (newG < neighbor.g || !openList.includes(neighbor)) {
                neighbor.g = newG;
                neighbor.h = neighbor.heuristic(targetCell);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = currentCell;

                if (!openList.includes(neighbor)) {
                    openList.push(neighbor);
                }
            }
        }
    }
    // если мы не нашли путь, то возвращаем пустой список
    return [];
}

function pathIsExist(path) {
    return path.length != 0;
}

function drawCell(cell) {
    let color;
    if (cell.isPath) {
        color = '#FFE4B5';
    }
    else if (cell.isWall) {
        color = '#A9A9A9';
    } else {
        color = '#FFFFFF';
    }
    ctx.fillStyle = color;
    ctx.fillRect(cell.y * CELL_SIZE, cell.x * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    ctx.strokeStyle = '#696969';
    ctx.strokeRect(cell.y * CELL_SIZE, cell.x * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawPath(path) {
    for (let i = 1; i < path.length - 1;) {
        const currentCell = path[i];
        currentCell.isPath = true;
        setTimeout(() => { drawCell(currentCell) }, 75 * i++);
    }
}

function drawMap(field, startCell, targetCell) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < field.length; i++) {
        for (let j = 0; j < field[i].length; j++) {
            let cell = field[i][j];
            drawCell(cell);
        }
    }
    ctx.fillStyle = '#9ACD32';
    ctx.fillRect(startCell.y * CELL_SIZE, startCell.x * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    ctx.fillStyle = '#6495ED';
    ctx.fillRect(targetCell.y * CELL_SIZE, targetCell.x * CELL_SIZE, CELL_SIZE, CELL_SIZE);

}

function getRandomCell(field) {
    let row = Math.floor(Math.random() * field.length);
    let col = Math.floor(Math.random() * field[0].length);
    return(!field[row][col].isWall)?field[row][col]:getRandomCell(field);
}

var field = createField(width);

canvas.onclick = function (event){
    let x = event.offsetX;
    let y = event.offsetY;
    x=Math.floor(x/CELL_SIZE);
    y=Math.floor(y/CELL_SIZE);
    field[y][x].isWall=true;
    addWall(field[y][x]);
}

addObstacles(field,WALLS);

let start = getRandomCell(field);
let end = getRandomCell(field);

drawMap(field, start, end);

startBttn.addEventListener('click', () => {
    let path = AStarAlgorithm(start, end, field);
    return pathIsExist(path)?drawPath(path):alert("path doesn't exist:(")
})
clearBttn.addEventListener('click',()=>{
    window.location.reload();
})
