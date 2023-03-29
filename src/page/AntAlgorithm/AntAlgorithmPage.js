import React, {useEffect} from 'react';
import {Button} from "react-bootstrap";
import '../../style/canvas.css'
import '../../style/grid.css'
import {antAlgorithm} from "./AlgorithmImpl";
import {Point} from "./Point";

export const CANVAS_HEIGHT = 500;
export const CANVAS_WIDTH = 800;
export const points = [];

const initListeners = (canvas) => {
    let ctx = canvas.getContext('2d');
    document.getElementById('canvas').addEventListener(
        'click',
        (e) => {
            points.push(new Point(e.offsetX, e.offsetY, ctx));
            points[points.length - 1].draw();
        }
    );
    document.getElementById('clear-button').addEventListener(
        'click',
        () => {
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        }
    );
}

const AntAlgorithmPage = () => {
    useEffect(() => {
        const canvas = document.getElementById('canvas');
        canvas.height = CANVAS_HEIGHT;
        canvas.width = CANVAS_WIDTH;
        initListeners(canvas);
    });

    return (
        <div>
            <div className={'d-grid gap-2 buttons-panel'}>
                <Button onClick={antAlgorithm}>Старт</Button>
                <Button id={'clear-button'}>Очистить</Button>
            </div>
            <div>
                <canvas id={'canvas'} className={'component-right canvas'}></canvas>
            </div>
        </div>
    );
};

export default AntAlgorithmPage;