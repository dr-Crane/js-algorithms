import React, {useEffect} from 'react';
import {Button} from "react-bootstrap";
import '../../style/canvas.css'
import '../../style/grid.css'
import {initListeners} from "./Utils";

export const CANVAS_HEIGHT = 500;
export const CANVAS_WIDTH = 800;
export let points = [];

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
                <Button>Старт</Button>
                <Button id={'clear-button'}>Очистить</Button>
            </div>
            <div>
                <canvas id={'canvas'} className={'component-right canvas'}></canvas>
            </div>
        </div>
    );
};

export default AntAlgorithmPage;