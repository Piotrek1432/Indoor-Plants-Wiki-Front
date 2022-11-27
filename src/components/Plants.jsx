import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import { Table } from "react-bootstrap";

export const Plants = () => {

    const [appState, setAppState] = useState({ plants: []})

    useEffect( () => {
        const url = "http://localhost:8071/plants";
        fetch(url)
            .then( data => data.json() )
            .then( response => setAppState({plants: response}));
    }, [] ) ;

    return (
        <>
        <h1>WSZYSTKIE ROŚLINY</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nazwa</th>
                        <th>Opis</th>
                    </tr>
                </thead>
                <tbody>            
                    {appState.plants.map( (plant, index) => {
                        return (
                        <tr key={index}>
                                <td>{plant.name}</td>
                                <td>{plant.description}</td>
                        </tr>
                        )
                    })}
                </tbody> 
            </Table>
        </>
    )
}