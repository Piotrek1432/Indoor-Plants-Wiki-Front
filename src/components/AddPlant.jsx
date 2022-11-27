import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

export const AddPlant = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const addNewPlant = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const newPlant = {
            name: name,
            description: description
        }

        const url = "http://localhost:8071/plants";

        fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(newPlant)
        }).then(data => console.log(data));
    }

    return (
        <>
        <h1>DODAJ ROŚLINĘ</h1>
        <Form>
            <Form.Group>
            <Form.Label>Nazwa:</Form.Label>
                <input type="text" name="name" value={name} onChange={event=>setName(event.target.value)}/>
                <br/>
            </Form.Group>
            <Form.Group>
            <Form.Label>Opis:</Form.Label>
                <input type="text" name="description" value={description} onChange={event=>setDescription(event.target.value)}/>
                <br/>
            </Form.Group>
            <Button variant="success" type="submit" onClick={event => addNewPlant(event)}>Zatwierdź</Button>        
        </Form>
        </>
    )
}