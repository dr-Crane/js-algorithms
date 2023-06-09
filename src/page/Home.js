import React from 'react';
import {useNavigate} from "react-router-dom";
import {Button} from "react-bootstrap";
import '../style/grid.css';
import '../style/footer.css';
import Footer from "../component/Footer";
import Authors from "../component/Authors";

const Home = () => {
    const navigate = useNavigate();
    const buttonHorizontalMargin = {marginLeft: '30%', marginRight: '30%'};
    const centerTitle = {marginLeft: '45%'};

    const handleAntAlgorithmButton = () => {
        navigate('/ant-algorithm');
    }
    const handleAStarButton = () => {
        navigate('/a-star-algorithm');
    }
    const handleClusterButton = () => {
        navigate('/cluster-analysis-algorithm');
    }
    const handleDecisionButton = () => {
        navigate('/decision-tree-algorithm');
    }
    const handleGeneticButton = () => {
        navigate('/genetic-algorithm');
    }
    const handleNeuralButton = () => {
        navigate('/neural-network');
    }

    return (
        <div>
            <Authors/>
            <div className={'container component-center'}>
                <h1 className={'text-light mb-5'} style={centerTitle}>Задачи</h1>
                <div className={'d-grid gap-2'}>
                    <Button variant={'outline-light'} size={'lg'} onClick={handleAStarButton}
                            style={buttonHorizontalMargin}>A*</Button>
                    <Button variant={'outline-light'} size={'lg'} onClick={handleClusterButton}
                            style={buttonHorizontalMargin}>Алгоритм кластеризации</Button>
                    <Button variant={'outline-light'} size={'lg'} onClick={handleGeneticButton}
                            style={buttonHorizontalMargin}>Генетический алгоритм</Button>
                    <Button variant={'outline-light'} size={'lg'} onClick={handleAntAlgorithmButton}
                            style={buttonHorizontalMargin}>Муравьиный алгоритм</Button>
                    <Button variant={'outline-light'} size={'lg'} onClick={handleDecisionButton}
                            style={buttonHorizontalMargin}>Дерево решений</Button>
                    <Button variant={'outline-light'} size={'lg'} onClick={handleNeuralButton}
                            style={buttonHorizontalMargin}>Нейронная сеть</Button>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default Home;