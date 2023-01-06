import React, { useEffect } from 'react';
import { useState } from 'react';
import { useLocalState } from '../util/UseLocalStorage';
import axios from 'axios';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import { useDropzone } from 'react-dropzone';
import { createTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import { Box, CssBaseline, Paper, Toolbar, Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
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
        width:250
    },
    palette: {
        primary: green,
    },
    dropzoneContainer:{
        height:300,
        background:"#efefef",
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        borderStyle:"dashed",
        borderColor:"#aaa"
    },
    preview:{
        width:250,
        height:250,
        margin:"auto",
        display:"block",
        marginBottom:theme.spacing(2),
        objectFit: "contain"
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
      },
      buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
          backgroundColor: green[700],
        },
      },
      fabProgress: {
        color: green[500],
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1,
      },
      buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
      },
      formControl: {
        margin: theme.spacing(2),
        minWidth: 120,
      },
}));

const Dashboard = () => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [plants, setPlants] = useState(null);
    const [allPlants, setAllPlants] = useState(null);
    const [categories, setCategories] = useState(null);
    const [selectedPlantName, setSelectedPlantName] = useState('');
    const [selectedPlantId, setSelectedPlantId] = useState('');

    const [selectedCategory, setSelectedCategory] = useState({
        name: "Wszystkie rośliny",
        id: 0
    })

    const theme = createTheme({
        palette: {
          primary: green,
        },
      });

        //Do dropzone
        const classes = useStyles();
    
        /////

    useEffect(() => {
        fetch("http://localhost:8071/plants", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            method: "GET"
        }).then(response => {
            if(response.status === 200) return response.json();
        }).then(plantsData => {
            setPlants(plantsData);
            setAllPlants(plantsData);
        });

        fetch("http://localhost:8071/categories", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            method: "GET"
        }).then(response => {
            if(response.status === 200) return response.json();
        }).then(categoriesData => {
            setCategories(categoriesData);
        });
    },[]);

    function selectCategory(id,name) {
        setSelectedCategory(()=>({
            id: id,
            name: name
        }))
        console.log("Wybrana kategoria "+selectedCategory.name);
        console.log("id kategorii "+selectedCategory.id);
        fetch(`http://localhost:8071/plants/category/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            method: "GET"
        }).then(response => {
            if(response.status === 200) return response.json();
        }).then(plantsData => {
            setPlants(plantsData);
        });   
    }

    function addPlantToCategory(plantId,categoryId) {
        console.log("id rosliny "+plantId+" | id kategorii"+categoryId);
        fetch(`http://localhost:8071/categories/addPlant/${plantId}/${categoryId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            method: "POST"
        }).then(response => {
            if(response.status === 200) selectCategory(selectedCategory.id,selectedCategory.name);
        }); 
    }

    const handleChangeSelectedPlant = (event) => {    
        setSelectedPlantId(event.target.value);
      };

    return (
        <>
            <CssBaseline />
            <AppBar position="static" classes={{root: classes.appBarColor}}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title} component={'span'}>
                        <Box sx={{ fontFamily: 'Abhaya Libre' }}>Zalogowany uytkownik</Box>
                    </Typography>
                    <Typography component={'span'}>
                        <Button color="inherit" onClick={() => {setJwt("");
                        window.location.href = "/"
                    }}>Wyloguj</Button>
                    </Typography>
                </Toolbar>
            </AppBar>

            <div style={{ margin: "1em" }}>
            <ThemeProvider theme={theme}>
                <Button variant="contained" color="primary" onClick={() => window.location.href = `/addPlant`}>
                    <Box sx={{ fontFamily: 'Abhaya Libre' }}>
                        Dodaj roślinę
                    </Box>
                </Button>{"\xa0\xa0\xa0\xa0\xa0\xa0\xa0"}
                <Button variant="contained" color="primary">
                    <Box sx={{ fontFamily: 'Abhaya Libre' } } onClick={() => window.location.href = `/addCategory`}>
                        Dodaj kategorię
                    </Box>
                </Button>
            </ThemeProvider>
            </div>

            {/* categories: */}
            <div style={{ margin: "1em" }}>
                    <Typography variant="h6" className={classes.title} component={'span'}>
                        <Box sx={{ fontFamily: 'Abhaya Libre' }}>Kategorie: </Box>
                    </Typography>
                    <React.Fragment><Button variant="outlined" color="primary" onClick={() => window.location.href = "/dashboard"}>
                        <Box sx={{ fontFamily: 'Abhaya Libre' }}>
                            Wszystkie rośliny
                        </Box>
                        </Button>{"\xa0\xa0\xa0\xa0\xa0"}</React.Fragment>
                    {categories ? categories.map((category, index) =>
                        <React.Fragment key={index}><Button variant="outlined" color="primary" onClick={() => selectCategory(category.id, category.name)}>
                        <Box sx={{ fontFamily: 'Abhaya Libre' }}>
                            {category.name}
                        </Box>
                        </Button>{"\xa0"}</React.Fragment>
                    ) : <></>}
            </div>

            {/* Dodawanie do kat */}
            <div style={{ margin: "1em", width: "300px" }}>
                <Paper>
                    <Typography align="left" style={{padding:16}}>
                    {"\xa0"}Dodaj
                    </Typography>
                    <FormControl className={classes.formControl}>
                        <InputLabel>label</InputLabel>
                        <Select value={selectedPlantId} onChange={handleChangeSelectedPlant}>
                            {allPlants ? allPlants.map((plant,index) =>
                                <MenuItem key={index} value={plant.id}>{plant.name}</MenuItem>
                            ) : <MenuItem value=''>Nie wybrano</MenuItem>}
                            <MenuItem value=''>Nie wybrano</MenuItem>
                        </Select>
                    </FormControl>
                    <Typography align="left" style={{padding:16}}>
                    {"\xa0"}do kategorii <font color="green">{selectedCategory.name} </font>
                    </Typography>
                    {"\xa0\xa0\xa0"}<Button variant="contained" color="primary">
                        <Box sx={{ fontFamily: 'Abhaya Libre' } } onClick={() => addPlantToCategory(selectedPlantId,selectedCategory.id)}>
                        Zatwierdź
                        </Box>
                    </Button>  <br/> <br/>
                </Paper>
            </div>

            
            {/*  */}

            <div style={{ margin: "5em" }}>
                <Typography variant="h6" className={classes.title}>
                    <Box sx={{ fontFamily: 'Abhaya Libre' }}>{selectedCategory.name}: </Box><br/>
                </Typography>
                <Grid container spacing={2}>
                {plants ? plants.map((plant, index) =>
                <Grid key={index} container item sm={3} spacing={0}>
                    <Card className={classes.root}>
                        <CardActionArea onClick={() => window.location.href = `/plant/${plant.id}`}>
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
            <br/><br/><br/><br/><br/><br/>
        </>
    );
};

export default Dashboard;