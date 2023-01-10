import React, { useEffect, useState } from 'react';
import { useLocalState } from '../util/UseLocalStorage';
import { Box, CssBaseline, Paper, Toolbar, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import { createTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme)=>({
    title: {
        flexGrow: 1,
    },
    appBarColor: {
        backgroundColor: "darkgreen"
    },
    media: {
        height: 250,
    },
    root: {
        maxWidth: 250,
        width:250,
        height:350
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
      },
}));
const PlantView = () => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const plantId = window.location.href.split("/plant/")[1];
    const [plant, setPlant] = useState(null);
    const [signaturesModel, setSignaturesModel] = useState(null);
    const classes = useStyles();

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
        fetch(`http://localhost:8071/plants/readSignatures/${plantId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            method: "GET"
        }).then(response => {
            if(response.status === 200) return response.json();
        }).then(signaturesModel => {
            setSignaturesModel(signaturesModel);
            console.log(signaturesModel);
        });
    }, [])

    return (
        <>
            <CssBaseline />
            <AppBar position="static" classes={{root: classes.appBarColor}}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title} component={'span'}>
                        <Box sx={{ fontFamily: 'Abhaya Libre' }}>Baza roślin domowych</Box>
                    </Typography>
                    <Typography component={'span'}>
                        <Button color="inherit" onClick={() => {setJwt("");
                        window.location.href = "/"
                    }}>Wyloguj</Button>
                    </Typography>
                </Toolbar>
            </AppBar>
            {plant ? (
                <Container maxWidth="md"><Paper style={{ margin: "4em" }}>
                    <Typography variant="h4" align="center" style={{padding:8, fontFamily: 'Abhaya Libre', }}>
                        {plant.name} {jwt ?(<Button type="submit" variant="outlined" onClick={() => window.location.href = `/modifyPlant/${plant.id}`}>Zmodyfikuj wpis</Button>) : (<></>)}
                    </Typography>
                    <Typography align="center" style={{padding:1, fontSize:"12px", fontFamily: 'Abhaya Libre', }}>
                        {signaturesModel!==null ? <font  color="grey">Autor: {signaturesModel.authorName}<br/>Utworzono: {signaturesModel.createdOn}<br/>Ostatnia modyfikacja: {signaturesModel.updatedOn}</font> : <></> }
                    </Typography>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <img style={{ margin: "1em", marginLeft: "3em"}} height={250} width={250} src={plant.imagePath} alt='Brak zdjęcia'/>
                                </td>
                                <td>
                                    <Typography variant="h5" align="center" style={{padding:10, fontFamily: 'Abhaya Libre'}}>
                                        Opis
                                    </Typography>
                                    <Typography align="justify" style={{padding:10, fontFamily: 'Abhaya Libre'}}>
                                        {plant.description}
                                    </Typography>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Typography variant="h5" align="center" style={{padding:10, fontFamily: 'Abhaya Libre'}}>
                                        Pozytywne cechy
                                    </Typography>
                                    <Typography align="justify" style={{padding:16, fontFamily: 'Abhaya Libre'}}>
                                        {plant.positiveQualities}
                                    </Typography>
                                </td>
                                <td>
                                    <Typography variant="h5" align="center" style={{padding:10, fontFamily: 'Abhaya Libre'}}>
                                        Wymagane nasłonecznienie
                                    </Typography>
                                    <Typography align="justify" style={{padding:16, fontFamily: 'Abhaya Libre'}}>
                                        {plant.insolation}
                                    </Typography>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Typography variant="h5" align="center" style={{padding:10, fontFamily: 'Abhaya Libre'}}>
                                        Podlewanie
                                    </Typography>
                                    <Typography align="justify" style={{padding:16, fontFamily: 'Abhaya Libre'}}>
                                        {plant.watering}
                                    </Typography>
                                </td>
                                <td>
                                    <Typography variant="h5" align="center" style={{padding:10, fontFamily: 'Abhaya Libre'}}>
                                        Nawożenie
                                    </Typography>
                                    <Typography align="justify" style={{padding:16, fontFamily: 'Abhaya Libre'}}>
                                        {plant.fertilization}
                                    </Typography>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2">
                                    <Typography variant="h5" align="center" style={{padding:10, fontFamily: 'Abhaya Libre'}}>
                                        Podatności i sygnały wymagające szczególnej uwagi
                                    </Typography>
                                    <Typography align="justify" style={{padding:16, fontFamily: 'Abhaya Libre'}}>
                                        {plant.badSignals}
                                    </Typography>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Paper></Container>
            ) : (
                <></>
            )}
        </>
    );
};

export default PlantView;