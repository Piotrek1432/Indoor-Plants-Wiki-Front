import React from 'react';
import { useLocalState } from '../util/UseLocalStorage';
import axios from 'axios';

const Dashboard = () => {
    const [jwt, setJwt] = useLocalState("", "jwt");

    let config = {
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    }

    function createPlant() {
        console.log("test");
        fetch("http://localhost:8071/plants/test", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            method: "post"
        }).then(response => {
            return response.json();
        }).then(data => {
            console.log(data);
        });
    }


    return (
        <>
            <div>
                <h1>Hello there!</h1>
                <div>Yr JWT is {jwt}</div> 
            </div>
            <div style={{ margin: "2em" }}>
                <button onClick={() => createPlant()}>Przycisk</button>
            </div>
        </>
    );
};

export default Dashboard;