import React, {useEffect} from 'react';

const AStarAlgorithm = () => {
    useEffect(() => {
        window.location.href = 'http://127.0.0.1:5500/A_STAR_ALGORITHM/a-star.html';
    })

    return (
        <div>
            <h1 className={'text-light'}>A*</h1>
        </div>
    );
};

export default AStarAlgorithm;