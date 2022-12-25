import React, { useEffect }  from 'react';
import { useLocalState } from '../util/UseLocalStorage';
import { useState } from 'react';

const AdminPanel = () => {

    const [jwt, setJwt] = useLocalState("", "jwt");
    //const [plants, setPlants] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8071/administration/getAllPlantChangesToAccept", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            method: "GET"
        }).then(response => {
            if(response.status === 200) return response.json();
        }).then(plantsData => {
            console.log(plantsData);
        });
    },[]);


    return (
        <div>
            <h1>Panel administratora</h1>
        </div>
    );
};

export default AdminPanel;