import React from "react";
import {Route, Routes} from "react-router-dom";
import Home from "./page/Home";
import AntAlgorithmPage from "./page/AntAlgorithm/AntAlgorithmPage";
import AStarAlgorithm from "./page/AStarAlgorithm";
import ClusterAnalysisAlgorithm from "./page/ClusterAnalysisAlgorithm";
import DecisionTreeAlgorithm from "./page/DecisionTreeAlgorithm";
import GeneticAlgorithm from "./page/GeneticAlgorithm/GeneticAlgorithm";
import NeuralNetwork from "./page/NeuralNetwork";
import NotFoundPage from "./page/NotFoundPage";

function App() {

    return (
        <div>
            <Routes>
                <Route path={'/'} element={<Home/>}/>
                <Route path={'/ant-algorithm'} element={<AntAlgorithmPage/>}/>
                <Route path={'/a-star-algorithm'} element={<AStarAlgorithm/>}/>
                <Route path={'/cluster-analysis-algorithm'} element={<ClusterAnalysisAlgorithm/>}/>
                <Route path={'/decision-tree-algorithm'} element={<DecisionTreeAlgorithm/>}/>
                <Route path={'/genetic-algorithm'} element={<GeneticAlgorithm/>}/>
                <Route path={'/neural-network'} element={<NeuralNetwork/>}/>
                <Route path={'*'} element={<NotFoundPage/>}/>
            </Routes>
        </div>
    );
}

export default App;
