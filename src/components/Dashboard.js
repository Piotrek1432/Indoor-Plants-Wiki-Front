import React, { useEffect } from 'react';
import { useState } from 'react';
import { useLocalState } from '../util/UseLocalStorage';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [plants, setPlants] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8071/plants", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            method: "GET"
        }).then(response => {
            if(response.status === 200) return response.json();
        }).then(plantsData => {
            setPlants(plantsData);
        });
    },[]);

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
        }).then(plant => {
            console.log(plant);
            window.location.href = `/plant/${plant.id}`;
        });
    }

    return (
        <>
            <div style={{ margin: "2em" }}>
                <h1>Hello there!</h1>
                <div>Yr JWT is {jwt}</div> 
            </div>
            <div style={{ margin: "2em" }}>
                {plants ? plants.map(plant => <div>
                    <Link to={`/plant/${plant.id}`}>
                        Plant ID: {plant.id}
                    </Link>
                </div>) : <></>}
                <button onClick={() => createPlant()}>Przycisk</button>
            </div>
        </>
    );
};

export default Dashboard;