import React, {useEffect} from 'react';

const ClusterAnalysisAlgorithm = () => {
    useEffect(() => {
        window.location.href = 'http://127.0.0.1:5500/CLUSTER_ALGORITHM/cluster.html';
    })

    return (
        <div>
            <h1 className={'text-light'}>Cluster analysis algorithm</h1>
        </div>
    );
};

export default ClusterAnalysisAlgorithm;