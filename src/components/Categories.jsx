import React, { useEffect, useState} from "react";

export const Categories = () =>{

    const [appState, setAppState] = useState({ categories: []})

    useEffect( () => {
        const url = "http://localhost:8071/categories";
        fetch(url)
            .then( data => data.json() )
            .then( response => setAppState({categories: response}));
    }, [] );

    return (
        <>
        <h1>WSZYSTKIE KATEGORIE</h1>
        <table>
            <thead>
                <tr>
                    <th>Nazwa Kategorii</th>
                    <th>Opis Kategorii</th>
                </tr>
            </thead>
            <tbody>
                {appState.categories.map( (category, index) => {
                    return (
                    <tr key={index}>
                            <td>{category.name}</td>
                            <td>{category.description}</td>
                    </tr>
                    )
                })}
            </tbody>
        </table>
        </>
    )
}