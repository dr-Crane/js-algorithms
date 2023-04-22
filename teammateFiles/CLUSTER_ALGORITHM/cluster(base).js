const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const height = canvas.height;
const width = canvas.width;

const ADD_BUTTON = document.getElementById("addBttn");
const START_BUTTON = document.getElementById("startBttn");
const CLEAR_BUTTON = document.getElementById("clearBttn");

const COLORS = ['#FC3030', '#FCAA05', '#FFF700', '#7CD424', '#70DEFF', '#3074FC', '#6823C2', '#FF00F7', '#7674DB', '#DB7474', '#B0B0B0', '#000000'];
let EXTREMES = [];
const POINTS = [];
let CENTROIDS = [];
const DISTANCES = [];
let K;

function mainFunction() {
    EXTREMES = getDataExtremes();
    CENTROIDS = initCentroids(K);

    calcDistances();
    drawClusters();
    moveCentroids();
}

function getDataExtremes() {//перебирает все точки и каждое измерение в каждой точке и находит минимальное и максимальное значения (выбирает мин х и макс у)
    let extremes = [];

    for (let i = 0; i < POINTS.length; i++) {
        let point = POINTS[i];

        for (let j = 0; j < point.length; j++) {
            if (!extremes[j]) {
                extremes[j] = { min: 10000, max: -10000 };
            }

            if (point[j] < extremes[j].min) {
                extremes[j].min = point[j];
            }

            if (point[j] > extremes[j].max) {
                extremes[j].max = point[j];
            }
        }
    }

    return extremes;
}

function initCentroids(k) {

    for (let i = 0; i < k; i++) {
        let centroid = [];

        for (let j = 0; j < 2; j++) {
            centroid[j] = Math.random() * (EXTREMES[j].max - EXTREMES[j].min) + EXTREMES[j].min;
        }
        CENTROIDS.push(centroid);
    }

    return CENTROIDS;
}

function calcDistances() {//высчитывает расстояние от центроиды до точки

    for (let i = 0; i < POINTS.length; i++) {
        let point = POINTS[i];
        let distances = [];

        for (let j = 0; j < CENTROIDS.length; j++) {
            let centroid = CENTROIDS[j];
            let sum = 0;

            for (let p = 0; p < point.length; p++) {//вычисляем координаты вектора х и у
                let length = point[p] - centroid[p];
                length *= length;
                sum += length;
            }

            distances[j] = Math.sqrt(sum);
        }

        DISTANCES[i] = distances.indexOf(Math.min.apply(null, distances));//для каждой точки записываем раст. до центроида
    }
}

function calculateCentroids() {//вычисляютя новые значения центроид

    calcDistances();

    let newCentroids = Array(CENTROIDS.length);//храним новые коорд центроид
    let counts = Array(CENTROIDS.length);//для усреднения позиции каждой центроиды
    let moved = false;

    for (let i = 0; i < CENTROIDS.length; i++) {
        counts[i] = 0;
        newCentroids[i] = Array(CENTROIDS[i].length);
        for (let j in CENTROIDS[i]) {
            newCentroids[i][j] = 0;
        }
    }

    for (let i = 0; i < DISTANCES.length; i++) {
        let centroid_index = DISTANCES[i];
        let point = POINTS[i];
        let centroid = CENTROIDS[centroid_index];

        counts[centroid_index]++;

        for (let j = 0; j < centroid.length; j++) {
            newCentroids[centroid_index][j] += point[j];
        }
    }

    for (let centroid_index = 0; centroid_index < newCentroids.length; centroid_index++) {
        if (counts[centroid_index] === 0) {
            newCentroids[centroid_index] = CENTROIDS[centroid_index];

            for (let j = 0; j < 2; j++) {
                newCentroids[centroid_index][j] = Math.random() * (EXTREMES[j].max - EXTREMES[j].min) + EXTREMES[j].min;
            }
            continue;
        }

        for (let j = 0; j < newCentroids[centroid_index].length; j++) {
            newCentroids[centroid_index][j] /= counts[centroid_index];//усредняем х и у
        }
    }

    if (CENTROIDS.toString() !== newCentroids.toString()) {
        moved = true;
    }

    CENTROIDS = newCentroids;

    return moved;
}

function drawPoints() {

    ctx.globalAlpha = 1;
    for (let i = 0; i < POINTS.length; i++) {
        ctx.save();

        let [x, y] = POINTS[i];
        ctx.fillStyle = '#FFFFFF';

        ctx.translate(x, y);
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        ctx.restore();

    }

}

function drawClusters() {
    ctx.clearRect(0, 0, width, height);
    drawPoints();
    for (let i = 0; i < CENTROIDS.length; i++) {

        for (let j = 0; j < DISTANCES.length; j++) {

            let centroid_index = DISTANCES[j];
            ctx.globalAlpha = 0.15;
            ctx.save();

            ctx.strokeStyle = '#FFFFFF';
            ctx.fillStyle = COLORS[centroid_index];

            ctx.beginPath();
            let [x1, y1] = POINTS[j];
            let [x2, y2] = CENTROIDS[centroid_index];

            ctx.fill();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.closePath();

            ctx.globalAlpha = 0.75;
            ctx.translate(x1, y1);
            ctx.arc(0, 0, 5, 0, Math.PI * 2, true);
            ctx.fill();

            ctx.restore();

        }

        ctx.globalAlpha = 0.5;
        ctx.save();

        let [x1, y1] = CENTROIDS[i];
        ctx.fillStyle = COLORS[i];
        ctx.translate(x1, y1);

        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.closePath();

        ctx.restore();

    }

}

function moveCentroids() { //смещает центроиды пока они сдвигаются
    drawClusters();

    if (calculateCentroids()) {
        setTimeout(moveCentroids, 1000);
    }
}

//<---------------------MAIN------------------------>

ADD_BUTTON.addEventListener('click', () => {
    canvas.onclick = function (event) {
        let x = event.offsetX;
        let y = event.offsetY;
        POINTS.push([x, y]);
        drawPoints();
    }
})

START_BUTTON.addEventListener('click', () => {
    K = document.getElementById("user_input").value
    return (POINTS.length!==0)?mainFunction():alert("Add data, please!");
})

CLEAR_BUTTON.addEventListener('click', () => {
    window.location.reload();
})

