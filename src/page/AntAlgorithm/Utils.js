import {addPoint} from "./CanvasUtils";
import {CANVAS_HEIGHT, CANVAS_WIDTH} from "./AntAlgorithmPage";

export const initListeners = (canvas) => {
    let ctx = canvas.getContext('2d');
    document.getElementById('canvas').addEventListener(
        'click',
        (e) => {
            addPoint(e.offsetX, e.offsetY, ctx)
        }
    );
    document.getElementById('clear-button').addEventListener(
        'click',
        () => {
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        }
    );
}