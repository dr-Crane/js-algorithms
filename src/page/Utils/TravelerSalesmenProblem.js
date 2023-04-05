export const CANVAS_HEIGHT = 500;
export const CANVAS_WIDTH = 800;

export const clearCanvas = (ctx) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

export const getDistance = (a, b) => {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

export const initDistanceMatrix = (points) => {
    let distanceMatrix = new Array(points.length);
    for (let i = 0; i < points.length; i++) {
        distanceMatrix[i] = new Array(points.length);
        for (let j = 0; j < points.length; j++) {
            distanceMatrix[i][j] = (i !== j ? getDistance(points[i], points[j]) : 0);
        }
    }
    return distanceMatrix;
}

export const initRouteMatrix = (points, numberOfRoutes) => {
    let routeMatrix = new Array(numberOfRoutes);
    for (let i = 0; i < numberOfRoutes; i++) {
        routeMatrix[i] = new Array(points.length);
    }
    return routeMatrix;
}