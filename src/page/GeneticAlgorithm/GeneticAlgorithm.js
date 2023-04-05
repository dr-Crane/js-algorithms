import React, {useEffect} from 'react';
import '../../style/canvas.css'
import '../../style/grid.css'
import {CANVAS_HEIGHT, CANVAS_WIDTH, clearCanvas} from "../Utils/TravelerSalesmenProblem";
import {geneticAlgorithm} from "./AlgorithmImpl";
import {Button} from "react-bootstrap";
import {Point} from "../Utils/Point";


const initListeners = (canvas, points) => {
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
            points = []
            clearCanvas(ctx);
        }
    );
    document.getElementById('start-button').addEventListener(
        'click',
        () => {
            if (points.length < 2) {
                alert("Вершин должно быть больше двух");
            } else {
                geneticAlgorithm(ctx, points).then(() => null);
            }
        }
    );
}

const GeneticAlgorithm = () => {
    useEffect(() => {
        let points = [];
        const canvas = document.getElementById('canvas');
        canvas.height = CANVAS_HEIGHT;
        canvas.width = CANVAS_WIDTH;
        initListeners(canvas, points);
    });

    return (
        <div>
            <div className={'d-grid gap-2 buttons-panel'}>
                <Button id={'start-button'}>Старт</Button>
                <Button id={'clear-button'}>Очистить</Button>
            </div>
            <div>
                <canvas id={'canvas'} className={'component-right canvas'}></canvas>
            </div>
        </div>
    );
};

export default GeneticAlgorithm;