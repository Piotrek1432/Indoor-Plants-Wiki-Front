import React, { useEffect }  from 'react';
import { useLocalState } from '../util/UseLocalStorage';
import { useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

const AdminPanel = () => {
    const classes = useStyles();
    const [jwt, setJwt] = useLocalState("", "jwt");
    
    const [changesState, setChangesState] = useState({changes: []})

    useEffect(() => {
        fetch("http://localhost:8071/administration/getAllPlantChangesToAccept", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            method: "GET"
        }).then(response => {
            if(response.status === 200) return response.json();
        }).then(data => {
            setChangesState({changes: data});
            console.log(data);
        });
    },[]);

    function handleSubmit(id) {
        console.log("do zatwierdzenia "+id);
    }

    function handleReject(id) {
        console.log("do odrzucenia "+id);
    }

    return (
        <div>
            <h1>Panel administratora</h1>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Nazwa</TableCell>
                        <TableCell>Opis</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {changesState.changes.map( (changes, index) => {
                        return (
                        <TableRow key={index}>
                                <TableCell>{changes.name}</TableCell>
                                <TableCell>{changes.description}</TableCell>
                                <TableCell><Button onClick={() => handleSubmit(changes.id)}>Zatweirdz</Button></TableCell>
                                <TableCell><Button onClick={() => handleReject(changes.id)}>Odrzuć</Button></TableCell>
                        </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    );
};

export default AdminPanel;