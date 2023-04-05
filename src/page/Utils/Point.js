const RADIUS = 10;
const COLOR = '#399650';

export class Point {

    constructor(x, y, ctx) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.fillStyle = COLOR;
        this.ctx.arc(this.x, this.y, RADIUS, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.closePath();
    }
}