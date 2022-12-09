import React from 'react';
import { useLocalState } from '../util/UseLocalStorage';

const Dashboard = () => {
    const [jwt, setJwt] = useLocalState("", "jwt");


    return (
        <>
            <div>
                <h1>Hello there!</h1>
                <div>Yr JWT is {jwt}</div> 
            </div>
            <div style={{ margin: "2em" }}>
                <button>Przycisk</button>
            </div>
        </>
    );
};

export default Dashboard;