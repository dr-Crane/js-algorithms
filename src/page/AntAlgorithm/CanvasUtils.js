import {points} from "./AntAlgorithmPage";
import {Point} from "./Point";

export const addPoint = (x, y, ctx) => {
    points.push(new Point(x, y, ctx));
    points[points.length - 1].draw();
}