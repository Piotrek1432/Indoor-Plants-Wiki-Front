import React, { useEffect }  from 'react';
import { useLocalState } from '../util/UseLocalStorage';
import { useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Box, CssBaseline, Toolbar, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';

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
        fetch(process.env.REACT_APP_SPRING_URL+"/administration/getAllPlantChangesToAccept", {
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
        fetch(process.env.REACT_APP_SPRING_URL+`/administration/acceptNewPlant/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            method: "PATCH"
        }).then(response => {
            if(response.status === 200)window.location.href = "/adminPanel"
            else return Promise.reject("Błąd dodawania - nie można dodać kolejnej rośliny o takiej nazwie");
        }).catch((message) => {
            alert(message);
        });
    }

    function handleReject(id) {
        console.log("do odrzucenia "+id);
        fetch(process.env.REACT_APP_SPRING_URL+`/administration/rejectNewPlant/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            method: "PATCH"
        }).then(response => {
            if(response.status === 200)window.location.href = "/adminPanel"
        });
    }

    return (
        <div>
            <CssBaseline />
            <AppBar position="static" classes={{root: classes.appBarColor}}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        <Box sx={{ fontFamily: 'Abhaya Libre' }}>Panel Administratora</Box>
                    </Typography>
                    <Typography>
                        <Button color="inherit" onClick={() => {setJwt("");
                        window.location.href = "/"
                    }}>Wyloguj</Button>
                    </Typography>
                </Toolbar>
            </AppBar>
            <Table style={{ margin: "1em" }} className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Nazwa</TableCell>
                        <TableCell>Opis</TableCell>
                        <TableCell>Pozytywne cechy</TableCell>
                        <TableCell>Nasłonecznienie</TableCell>
                        <TableCell>Nawadnianie</TableCell>
                        <TableCell>Nawożenie i podłoże</TableCell>
                        <TableCell>Podatności</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {changesState.changes.map( (changes, index) => {
                        return (
                        <TableRow key={index}>
                                <TableCell>{changes.name}</TableCell>
                                <TableCell>{changes.description}</TableCell>
                                <TableCell>{changes.positiveQualities}</TableCell>
                                <TableCell>{changes.insolation}</TableCell>
                                <TableCell>{changes.watering}</TableCell>
                                <TableCell>{changes.fertilization}</TableCell>
                                <TableCell>{changes.badSignals}</TableCell>
                                <TableCell><img width={100} height={100} src={changes.imagePath} alt='Brak zdjęcia'/></TableCell>
                                <TableCell><Button variant="contained" color="primary" onClick={() => handleSubmit(changes.id)}>Zatweirdz</Button></TableCell>
                                <TableCell><Button variant="contained" color="primary" onClick={() => handleReject(changes.id)}>Odrzuć</Button></TableCell>
                        </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    );
};

export default AdminPanel;