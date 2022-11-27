import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

export const AddCategory = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const addNewCategory = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const newCategory = {
            name: name,
            description: description,
            plants: []
        }

        const url = "http://localhost:8071/categories";

        fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(newCategory)
        }).then(data => console.Consolelog(data));
    }


    return (
        <>
        <h1>DODAJ KATEGORIĘ</h1>
        <Form>
            <Form.Group>
            <Form.Label>Nazwa kategorii:</Form.Label>
                <input type="text" name="name" value={name} onChange={event=>setName(event.target.value)}/>
                <br/>
            </Form.Group>
            <Form.Group>
            <Form.Label>Opis kategorii:</Form.Label>
                <input type="text" name="description" value={description} onChange={event=>setDescription(event.target.value)}/>
                <br/>
            </Form.Group>
            <Button variant="success" type="submit" onClick={event => addNewCategory(event)}>Zatwierdź</Button>        
        </Form>
        </>
    )
}