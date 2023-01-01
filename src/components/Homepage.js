import React, { useEffect } from 'react';
import { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { Box, CssBaseline, Toolbar, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';


const useStyles = makeStyles((theme) => ({
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
        width:250
      },
  }));

const Homepage = () => {
    const classes = useStyles();
    const [plants, setPlants] = useState(null);

    function goToLoginPage() {
        window.location.href = "login";
    }

    function goToRegistrationPage() {
        window.location.href = "register";
    }

    useEffect(() => {
        fetch("http://localhost:8071/plants", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "GET"
        }).then(response => {
            if(response.status === 200) return response.json();
        }).then(plantsData => {
            setPlants(plantsData);
            console.log(plantsData);
        });
    },[]);

    return (
        <>
            <CssBaseline />
            <AppBar position="static" classes={{root: classes.appBarColor}}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title} component={'span'}>
                        <Box sx={{ fontFamily: 'Abhaya Libre' }}>Strona główna</Box>
                    </Typography>
                    <Typography component={'span'}>
                        <Button sx={{ fontFamily: 'Abhaya Libre' }} color="inherit" onClick={() => goToLoginPage()}>Zaloguj</Button>
                        <Button color="inherit" onClick={() => goToRegistrationPage()}>Zarejestruj</Button>
                    </Typography>
                </Toolbar>
            </AppBar>
            <br/>



            <div style={{ margin: "5em" }}>
                <Grid container spacing={2}>
                {plants ? plants.map((plant,index) =>
                <Grid key={index} container item sm={3} spacing={0}>
                    <Card className={classes.root}>
                        <CardActionArea onClick={() => goToRegistrationPage()}>
                            <CardMedia 
                            className={classes.media}
                            image={plant.imagePath}
                            title="plant image"
                            component='img'
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    <Box sx={{ fontFamily: 'Abhaya Libre' }}>
                                        {plant.name}
                                    </Box>
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component={'span'}>
                                    <Box sx={{ fontFamily: 'Abhaya Libre' }}>
                                        {plant.description}
                                    </Box>
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                ) : <></>}
                </Grid>    
            </div> 
        </>
    );
};

export default Homepage;