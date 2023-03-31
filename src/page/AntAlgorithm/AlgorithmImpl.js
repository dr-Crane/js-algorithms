import {updateCanvas} from "./CanvasUtils";

const ALPHA = 1;
const BETA = 1;
const EVAPORATION_RATE = 0.5;
const Q = 100;
const ANTS_AMOUNT = 100;
const PHEROMONES_DEFAULT_VALUE = 1;
const ITERATIONS_COUNT = 100;

let distanceMatrix;
let pheromonesMatrix;
let routeMatrix;
let routeLength;

export const antAlgorithm = async (ctx, points) => {
    let minPathLength = 0;
    let minPathIndex = 0;
    let path = null;
    initDistanceMatrix(points);
    initPheromonesMatrix(points);
    for (let i = 0; i < ITERATIONS_COUNT; i++) {
        routeLength = new Array(ANTS_AMOUNT);
        initRouteMatrix(points);
        runAllAnts(points);
        updatePheromones();
        minPathIndex = getIndexOfMinimumValue();
        if (minPathLength === 0 || routeLength[minPathIndex] < minPathLength) {
            minPathLength = routeLength[minPathIndex];
            path = getPath(routeMatrix[minPathIndex]);
            await (100);
        }
    }
    updateCanvas(path, ctx, points);
}

const runAllAnts = (points) => {
    for (let j = 0; j < ANTS_AMOUNT; j++) {
        let currentPoint = 0
        for (let k = 0; k < points.length; k++) {
            routeMatrix[j][k] = currentPoint;
            currentPoint = getNextPoint(j, currentPoint, points);
        }
        routeLength[j] = getRouteLength(j);
    }
}

const getPath = (route) => {
    let path = [];
    let currentPoint = 0;
    let nextPoint = 0;
    for (let i = 1; i < route.length; i++) {
        nextPoint = route[i];
        path.push({
            from: currentPoint,
            to: nextPoint
        });
        currentPoint = nextPoint;
    }
    path.push({
        from: currentPoint,
        to: 0
    });
    return path;
}

const getIndexOfMinimumValue = () => {
    let minIndex = 0;
    for (let i = 0; i < routeLength.length; i++) {
        if (routeLength[minIndex] > routeLength[i]) {
            minIndex = i;
        }
    }
    return minIndex;
}

const updatePheromones = () => {
    for (let i = 0; i < pheromonesMatrix.length; i++) {
        for (let j = 0; j < pheromonesMatrix[i].length; j++) {
            if (i !== j) {
                pheromonesMatrix[i][j] = pheromonesMatrix[i][j] * EVAPORATION_RATE;
            }
        }
    }
    sprayNewPheromones()
}

const sprayNewPheromones = () => {
    let delta = new Array(ANTS_AMOUNT);
    for (let i = 0; i < ANTS_AMOUNT; i++) {
        delta[i] = Q / routeLength[i];
    }
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

const getPossiblePoints = (points, antIndex) => {
    let possiblePoints = [];
    for (let i = 1; i < points.length; i++) {
        if (!routeMatrix[antIndex].includes(i)) {
            possiblePoints.push(i);
        }
    }
    return possiblePoints;
}

function getAntsChoiceProbabilities(possiblePoints, currentPoint) {
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
    return probability;
}

const getNextPoint = (antIndex, currentPoint, points) => {
    let possiblePoints = getPossiblePoints(points, antIndex);
    if (possiblePoints.length === 0) {
        return 0;
    }
    let probability = getAntsChoiceProbabilities(possiblePoints, currentPoint);
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

const initRouteMatrix = (points) => {
    routeMatrix = new Array(ANTS_AMOUNT);
    for (let i = 0; i < ANTS_AMOUNT; i++) {
        routeMatrix[i] = new Array(points.length);
    }
}

const initPheromonesMatrix = (points) => {
    pheromonesMatrix = new Array(points.length);
    for (let i = 0; i < points.length; i++) {
        pheromonesMatrix[i] = new Array(points.length);
        for (let j = 0; j < points.length; j++) {
            pheromonesMatrix[i][j] = (i !== j ? PHEROMONES_DEFAULT_VALUE : 0);
        }
    }
}

const initDistanceMatrix = (points) => {
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