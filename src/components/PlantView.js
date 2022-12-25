import React, { useEffect, useState } from 'react';
import { useLocalState } from '../util/UseLocalStorage';

const PlantView = () => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const plantId = window.location.href.split("/plant/")[1];
    const [plant, setPlant] = useState(null)

    useEffect(() => {
        fetch(`http://localhost:8071/plants/${plantId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            method: "GET"
        }).then(response => {
            if(response.status === 200) return response.json();
        }).then(plantData => {
            setPlant(plantData);
        });
    }, [])

    return (
        <div>
            <h1>ID Rośliny {plantId}</h1>
            {plant ? (
                <>
                    <h2>Nazwa: {plant.name}</h2>
                </>
            ) : (
                <></>
            )}
        </div>
    );
};

export default PlantView;