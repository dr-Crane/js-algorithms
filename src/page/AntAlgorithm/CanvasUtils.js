import {CANVAS_HEIGHT, CANVAS_WIDTH} from "./AntAlgorithmPage";

export const updateCanvas = (path, ctx, points, end) => {
    clearCanvas(ctx);
    for (let i = 0; i < path.length; i++) {
        ctx.strokeStyle = end ? '#4260f5' : '#b30b0b';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(points[path[i].from].x, points[path[i].from].y);
        ctx.lineTo(points[path[i].to].x, points[path[i].to].y);
        ctx.stroke();
        ctx.closePath();
    }
    for (let i = 0; i < points.length; i++) {
        points[i].draw();
    }
}

export const clearCanvas = (ctx) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}