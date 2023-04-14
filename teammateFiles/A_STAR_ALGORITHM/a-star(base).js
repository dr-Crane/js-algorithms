const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

var CREATE_BUTTON = document.getElementById("createButton");
var BEGIN_BUTTON = document.getElementById("beginButton");
var TARGET_BUTTON = document.getElementById("targetButton");
var WALL_BUTTON = document.getElementById("wallButton");
var START_BUTTON = document.getElementById("startButton");
var CLEAR_BUTTON = document.getElementById("clearButton");
var INPUT_BUTTON = document.getElementById("inputButton");

var CELL_SIZE;
var field;

//храним начальную стенки, начальную и конечную точки
var WALLS = [];
var BEGGIN = [];
var TARGET = [];

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

function drawMap(field) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < field.length; i++) {
        for (let j = 0; j < field[i].length; j++) {
            let cell = field[i][j];
            drawCell(cell);
        }
    }
    //два цикла ниже рисуют границы вокруг карты
    for (let i = 0; i < field.length; i++) {
        addWall(field[0][i]);
        addWall(field[field.length - 1][i]);

    }
    for (let i = 1; i < field.length - 1; i++) {
        addWall(field[i][0]);
        addWall(field[i][field.length - 1]);
    }
}

function addBeggin(cell) {
    if (!cell.isStart) {
        cell.isStart = true;
        drawCell(cell);
        BEGGIN.push(cell);
    }
    if (BEGGIN.length >= 2) {//для перемещения начальной тосчки в другое место, старая исчезает
        BEGGIN[0].isStart = false;
        drawCell(BEGGIN[0]);
        BEGGIN.splice(0, 1);
    }
}

function addTarget(cell) {
    if (!cell.isTarget) {
        cell.isTarget = true;
        drawCell(cell);
        TARGET.push(cell);
    }
    if (TARGET.length >= 2) {//для перемещения конечной точки в другое место, старая исчезает
        TARGET[0].isTarget = false;
        drawCell(TARGET[0]);
        TARGET.splice(0, 1);
    }
}

function addWall(cell) {
    if (!(cell.isStart || cell.isTarget)) {//проверка на то является ли выбранная клетка начальной либо конечной
        if (!cell.isWall) {
            cell.isWall = true;
            drawCell(cell);
            WALLS.unshift(cell);
        } else {//если тыкнули на клетку-стенку, то удаляем её
            cell.isWall = false;
            const index = WALLS.shift();
            drawCell(cell);
            WALLS.splice(index, 1)
        }
    }
}

function pathIsExist(path) {
    return path.length != 0;
}

function drawCell(cell) {
    let color;
    if (cell.isStart) {
        color = '#B0FF4D';
    } else if (cell.isTarget) {
        color = '#FF4838';
    }
    else if (cell.isPath) {
        color = '#696969';
    } else if (cell.isOpen) {
        color = '#00BFFF';
    } else if (cell.isVisited) {
        color = '#87CEFA';
    }
    else if (cell.isWall) {
        color = '#FFFFFF';
    }
    else {
        color = '#212121';
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
        setTimeout(() => { drawCell(currentCell) }, 50 * i++);
    }
}

//<---------------------------MAIN------------------------------->

CREATE_BUTTON.addEventListener('click', () => {
    let width = document.getElementById("user_input").value;
    CELL_SIZE = canvas.width / width;
    field = createField(width);
    drawMap(field);
})

BEGIN_BUTTON.addEventListener('click', () => {
    canvas.onclick = function (event) {
        let x = event.offsetX;
        let y = event.offsetY;
        x = Math.floor(x / CELL_SIZE);
        y = Math.floor(y / CELL_SIZE);
        addBeggin(field[y][x]);
    }
});

TARGET_BUTTON.addEventListener('click', () => {
    canvas.onclick = function (event) {
        let x = event.offsetX;
        let y = event.offsetY;
        x = Math.floor(x / CELL_SIZE);
        y = Math.floor(y / CELL_SIZE);
        addTarget(field[y][x]);
    }
})

WALL_BUTTON.addEventListener('click', () => {
    canvas.onclick = function (event) {
        let x = event.offsetX;
        let y = event.offsetY;
        x = Math.floor(x / CELL_SIZE);
        y = Math.floor(y / CELL_SIZE);
        addWall(field[y][x]);
    }
});

START_BUTTON.addEventListener('click', () => {
    let path = AStarAlgorithm(BEGGIN[0], TARGET[0], field);
    return pathIsExist(path) ? drawPath(path) : alert("path doesn't exist:(")
});

CLEAR_BUTTON.addEventListener('click', () => {
    window.location.reload();
});