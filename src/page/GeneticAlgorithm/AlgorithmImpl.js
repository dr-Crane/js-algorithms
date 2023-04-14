import {initDistanceMatrix} from "../Utils/TravelerSalesmenProblem";
import {Chromosome} from "./Chromosome";
import {updateCanvas} from "../Utils/CanvasUtils";

const MUTATION_CONST = 70;
let populationNum;
let distanceMatrix;
let population;

export const geneticAlgorithm = async (ctx, points) => {
    distanceMatrix = initDistanceMatrix(points);
    populationNum = Math.pow(points.length, 2);
    population = [];
    createPopulation(points.length);
    for (let i = 0, j = 0; i < 1000 && j < 200; i++, j++) {
        let bestFit = population[0].fitness;
        nextGeneration(points.length);
        let newBestFit = population[0].fitness;
        if (bestFit === newBestFit) {
            j = 0;
        }
        updateCanvas(getPath(population[0].route), ctx, points, false);
        await new Promise(resolve => setTimeout(resolve, 1));
    }
    updateCanvas(getPath(population[0].route), ctx, points, true);
}

const getPath = (order) => {
    let path = [];
    for (let i = 0; i < order.length - 1; i++) {
        path.push({
            from: order[i],
            to: order[i + 1]
        });
    }
    path.push({
        from: order[order.length - 1],
        to: order[0]
    });
    return path;
}

const nextGeneration = (pointsLength) => {
    for (let i = 0; i < populationNum; i++) {
        let firstParent = getRandomRoute();
        let secondParent = getRandomRoute();
        if (firstParent === secondParent) {
            firstParent = getRandomRoute();
            secondParent = getRandomRoute();
        }
        let breakPoint = getRandomIndex(pointsLength);
        let firstChild = generateChild(firstParent, secondParent, breakPoint, pointsLength);
        let secondChild = generateChild(secondParent, firstParent, breakPoint, pointsLength);
        if (Math.floor(Math.random() * 100) < MUTATION_CONST) {
            firstChild = mutation(firstChild.slice());
            secondChild = mutation(secondChild.slice());
        }
        population.push(new Chromosome(firstChild.slice(), getRouteLength(firstChild.slice())));
        population.push(new Chromosome(secondChild.slice(), getRouteLength(secondChild.slice())));
    }
    population.sort((a, b) => a.fitness - b.fitness);
    population.splice(-1);
    population.splice(-1);
}

const mutation = (child) => {
    let indexA = getRandomIndex(child.length);
    let indexB = getRandomIndex(child.length);
    if (indexA === indexB) {
        indexA = getRandomIndex(child.length);
        indexB = getRandomIndex(child.length);
    }
    [child[indexA], child[indexB]] = [child[indexB], child[indexA]];
    return child;
}

const generateChild = (firstParent, secondParent, breakPoint, pointsLength) => {
    let child = [];
    for (let i = 0; i < breakPoint; i++) {
        child.push(firstParent[i]);
    }
    for (let i = breakPoint; i < pointsLength; i++) {
        if (!child.includes(secondParent[i])) {
            child.push(secondParent[i]);
        }
    }
    for (let i = 0; i < pointsLength; i++) {
        if (!child.includes(i)) {
            child.push(i);
        }
    }
    return child;
}

const createPopulation = (pointsLength) => {
    let route = new Array(pointsLength);
    for (let i = 0; i < pointsLength; i++) {
        route[i] = i;
    }
    population[0] = new Chromosome(route.slice(), getRouteLength(route.slice()));
    for (let i = 1; i < populationNum; i++) {
        let order = shuffle(route.slice());
        population[i] = new Chromosome(order, getRouteLength(order.slice()));
    }
    population.sort((a, b) => a.fitness - b.fitness);
}

const getRouteLength = (order) => {
    let length = 0;
    for (let i = 0; i < order.length - 1; i++) {
        length += distanceMatrix[order[i]][order[i + 1]];
    }
    length += distanceMatrix[order.length - 1][0];
    return length;
}

const shuffle = (order) => {
    for (let i = 0; i < 100; i++) {
        let indexA = getRandomIndex(order.length);
        let indexB = getRandomIndex(order.length);
        [order[indexA], order[indexB]] = [order[indexB], order[indexA]];
    }
    return order;
}

const getRandomRoute = () => {
    return population[getRandomIndex(population.length)].route.slice();
}

const getRandomIndex = (arrayLength) => {
    return Math.floor(Math.random() * arrayLength);
}



