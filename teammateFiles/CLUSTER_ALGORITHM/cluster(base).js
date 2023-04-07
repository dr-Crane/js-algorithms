var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var height = canvas.height;
var width = canvas.width;

var ADD_BUTTON = document.getElementById("addBttn");
var START_BUTTON = document.getElementById("startBttn");
var CLEAR_BUTTON = document.getElementById("clearBttn");


var COLORS = ['#FC3030', '#FCAA05', '#FFF700', '#7CD424', '#70DEFF', '#3074FC', '#6823C2'];
var POINTS = [];
var CENTROIDS = [];
var DISTANCES = [];
var EXTREMES = [];
var K;

function mainFunction() {

    EXTREMES = getDataExtremes();
    CENTROIDS = initCentroids(K);

    calcDistances();
    drawCentroids();
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

function initCentroids(k) {//инициализирует k случайных центроидов кластера

    for (let i = 0; i < k; i++) {
        let centroid = [];

        for (let j = 0; j < EXTREMES.length; j++) {
            centroid[j] = Math.random() * (EXTREMES[j].max - EXTREMES[j].min) + EXTREMES[j].min;
        }
        CENTROIDS.push(centroid);
    }

    return CENTROIDS;
};

function calcDistances() {//высчитывает расстояние от центроиды до точки

    for (let i = 0; i < POINTS.length; i++) {
        let point = POINTS[i];
        let distances = [];

        for (let j = 0; j < CENTROIDS.length; j++) {
            let centroid = CENTROIDS[j];
            let sum = 0;

            for (let p = 0; p < point.length; p++) {
                let length = point[p] - centroid[p];
                length *= length;
                sum += length;
            }

            distances[j] = Math.sqrt(sum);
        }

        DISTANCES[i] = distances.indexOf(Math.min.apply(null, distances));
    }
}

function calculateCentroids() {//вычисляютя новые значения центроид

    calcDistances();

    let newCentroids = Array(CENTROIDS.length);
    let counts = Array(CENTROIDS.length);
    let moved = false;

    for (let j = 0; j < CENTROIDS.length; j++) {
        counts[j] = 0;
        newCentroids[j] = Array(CENTROIDS[j].length);
        for (let dimension in CENTROIDS[j]) {
            newCentroids[j][dimension] = 0;
        }
    }

    for (let point_index in DISTANCES) {
        let centroid_index = DISTANCES[point_index];
        let point = POINTS[point_index];
        let centroid = CENTROIDS[centroid_index];

        counts[centroid_index]++;

        for (let dimension in centroid) {
            newCentroids[centroid_index][dimension] += point[dimension];
        }
    }

    for (let centroid_index in newCentroids) {
        if (counts[centroid_index] == 0) {
            newCentroids[centroid_index] = CENTROIDS[centroid_index];

            for (let dimension in EXTREMES) {
                newCentroids[centroid_index][dimension] = Math.random() * (EXTREMES[dimension].max - EXTREMES[dimension].min) + EXTREMES[dimension].min;
            }
            continue;
        }

        for (let dimension in newCentroids[centroid_index]) {
            newCentroids[centroid_index][dimension] /= counts[centroid_index];
        }
    }

    if (CENTROIDS.toString() != newCentroids.toString()) {// преобраз. массивы центроид и пересчитаннных центроид в строки. Если они одинаковы, значит центроиды не сдвинулись и мы разбили данные на кластеры
        moved = true;
    }

    CENTROIDS = newCentroids;//записываем новые центроиды

    return moved;
}

function drawPoints() {

    ctx.globalAlpha = 1;
    for (let i = 0; i < POINTS.length; i++) {
        ctx.save();

        let [x, y] = POINTS[i];
        ctx.fillStyle = "#FAFAFA";
        ctx.translate(x, y);
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 3);
        ctx.fill();
        ctx.closePath();

        ctx.restore();

    }

}

function drawCentroids() {
    ctx.clearRect(0, 0, width, height);
    drawPoints();

    for (let j = 0; j < DISTANCES.length; j++) {

        let centroid_index = DISTANCES[j];
        ctx.globalAlpha = 0.1;
        ctx.save();

        ctx.strokeStyle = '#FFFFFF';
        ctx.beginPath();
        let [x1, y1] = POINTS[j];
        let [x2, y2] = CENTROIDS[centroid_index];
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
    }


    for (let i = 0; i < CENTROIDS.length; i++) {
        ctx.globalAlpha = 1;
        ctx.save();

        let [x1, y1] = CENTROIDS[i];
        let color = COLORS[i];
        ctx.fillStyle = color;
        ctx.translate(x1, y1);

        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.closePath();

        ctx.restore();

    }
    
}

function moveCentroids() { //смещает центроиды пока они сдвигаются
    drawCentroids();

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
    mainFunction();
})

CLEAR_BUTTON.addEventListener('click', () => {
    window.location.reload();
})

