import {points} from "./AntAlgorithmPage";
import {updateCanvas} from "./CanvasUtils";

const ALPHA = 1;
const BETA = 1;
const EVAPORATION_RATE = 0.5;
const Q = 100;
const ANTS_AMOUNT = 100;
const PHEROMONES_DEFAULT_VALUE = 1;

let distanceMatrix;
let pheromonesMatrix;
let routeMatrix;
let routeLength = new Array(ANTS_AMOUNT);

export const antAlgorithm = () => {
    if (points.length < 2) {
        alert("Вершин должно быть больше двух");
        return;
    }
    initDistanceMatrix();
    initPheromonesMatrix();
    let minPathLength = 0;
    let minPathIndex = 0;
    for (let i = 0; i < 500; i++) {
        initRouteMatrix();
        runAnt(i);
        updatePheromones();
        minPathIndex = getIndexOfMinimumValue();
        if (minPathLength === 0 || routeLength[minPathIndex] < minPathLength) {
            minPathLength = routeLength[minPathIndex];
            updateCanvas(minPathIndex);
        }
    }
    updateCanvas(minPathIndex);
}

const getIndexOfMinimumValue = () => {
    let minIndex = 0;
    for (let i = 1; i < routeLength.length; i++) {
        if (routeLength[minIndex] > routeLength[i]) {
            minIndex = i;
        }
    }
    return minIndex;
}

const updatePheromones = () => {
    flyAwayPheromones();
    sprayNewPheromones()
}

const sprayNewPheromones = () => {
    let delta = calculateDelta();
    for (let i = 0; i < ANTS_AMOUNT; i++) {
        let currentPoint = 0;
        let nextPoint = 0;
        for (let j = 1; j < routeMatrix[i].length; j++) {
            nextPoint = routeMatrix[i][j];
            pheromonesMatrix[currentPoint][nextPoint] = pheromonesMatrix[currentPoint][nextPoint] + delta[i];
            currentPoint = nextPoint;
        }
        pheromonesMatrix[currentPoint][0] = pheromonesMatrix[currentPoint][0] + delta[i];
    }
}

const calculateDelta = () => {
    let delta = new Array(ANTS_AMOUNT);
    for (let i = 0; i < ANTS_AMOUNT; i++) {
        delta[i] = routeLength[i] !== undefined ? Q / routeLength[i] : 0;
    }
    return delta;
}

const flyAwayPheromones = () => {
    for (let i = 0; i < pheromonesMatrix.length; i++) {
        for (let j = 0; j < pheromonesMatrix[i].length; j++) {
            if (i !== j) {
                pheromonesMatrix[i][j] = pheromonesMatrix[i][j] * EVAPORATION_RATE;
            }
        }
    }
}

const runAnt = (antIndex) => {
    let currentPoint = 0;
    for (let i = 0; i < points.length; i++) {
        routeMatrix[antIndex][i] = currentPoint;
        currentPoint = getNextPoint(antIndex, currentPoint);
    }
    routeLength[antIndex] = getRouteLength(antIndex);
}

const getRouteLength = (antIndex) => {
    let length = 0;
    let currentPoint = 0;
    let nextPoint = 0;
    for (let i = 1; i < routeMatrix[antIndex].length; i++) {
        nextPoint = routeMatrix[antIndex][i];
        length = length + distanceMatrix[currentPoint][nextPoint];
        currentPoint = nextPoint;
    }
    length = length + distanceMatrix[currentPoint][0];
    return length;
}

const getNextPoint = (antIndex, currentPoint) => {
    let possiblePoints = getPossiblePoints(antIndex, currentPoint);
    if (possiblePoints.length === 0) {
        return 0;
    }
    return getAntsWish(currentPoint, possiblePoints)
}

const getAntsWish = (currentPoint, possiblePoints) => {
    let numerator = new Array(possiblePoints.length);
    let denominator = 0;
    for (let i = 0; i < possiblePoints.length; i++) {
        let nextPoint = possiblePoints[i];
        let l = Math.pow(pheromonesMatrix[currentPoint][nextPoint], ALPHA);
        let f = Math.pow((1 / distanceMatrix[currentPoint][nextPoint]), BETA);
        numerator[i] = l * f;
        denominator = denominator + f * l;
    }
    let probability = new Array(possiblePoints.length);
    for (let i = 0; i < possiblePoints.length; i++) {
        probability[i] = numerator[i] / denominator;
    }
    let currentRange = probability[0];
    let random = Math.random();
    for (let i = 1; i < possiblePoints.length; i++) {
        if (currentRange >= random) {
            return possiblePoints[i - 1];
        }
        currentRange = currentRange + probability[i];
    }
    return possiblePoints[possiblePoints.length - 1];
}

const getPossiblePoints = (antIndex) => {
    let possiblePoints = [];
    for (let i = 1; i < points.length; i++) {
        if (!routeMatrix[antIndex].includes(i)) {
            possiblePoints.push(i);
        }
    }
    return possiblePoints;
}

const initRouteMatrix = () => {
    routeMatrix = new Array(ANTS_AMOUNT);
    for (let i = 0; i < ANTS_AMOUNT; i++) {
        routeMatrix[i] = new Array(points.length);
    }
}

const initPheromonesMatrix = () => {
    pheromonesMatrix = new Array(points.length);
    for (let i = 0; i < points.length; i++) {
        pheromonesMatrix[i] = new Array(points.length);
        for (let j = 0; j < points.length; j++) {
            pheromonesMatrix[i][j] = (i !== j ? PHEROMONES_DEFAULT_VALUE : 0);
        }
    }
}

const initDistanceMatrix = () => {
    distanceMatrix = new Array(points.length);
    for (let i = 0; i < points.length; i++) {
        distanceMatrix[i] = new Array(points.length);
        for (let j = 0; j < points.length; j++) {
            distanceMatrix[i][j] = (i !== j ? getDistance(points[i], points[j]) : 0);
        }
    }
}

const getDistance = (a, b) => {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}