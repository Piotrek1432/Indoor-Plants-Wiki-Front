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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Pagination from '@material-ui/lab/Pagination';


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
    const [allPlantsOutOfCategory, setAllPlantsOutOfCategory] = useState(null);
    const [categories, setCategories] = useState(null);
    const [selectedPlantName, setSelectedPlantName] = useState('');
    const [selectedPlantId, setSelectedPlantId] = useState('');
    const classes = useStyles();
    const [radioValue, setRadioValue] = React.useState('Add');
    const [pagePlant, setPagePlant] = React.useState(null);
    const [numberOfPages,setNumberOfPages] = useState(0);

    const [selectedCategory, setSelectedCategory] = useState({
        name: "Wszystkie rośliny",
        description: "",
        id: 0
    })

    const theme = createTheme({
        palette: {
          primary: green,
        },
      });

      const handleRadioChange = (event) => {
        setRadioValue(event.target.value);
        setSelectedPlantId('');
      };

    useEffect(() => {
        fetch("http://localhost:8071/plants?sort=name", {
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
            setPagePlant(plantsData.slice(0,12));
            setNumberOfPages(Math.ceil(plantsData.length/12));
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
            console.log(categoriesData);
        });
    },[]);

    function selectCategory(id,name, description) {
        setSelectedCategory(()=>({
            id: id,
            name: name,
            description: description
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
            setPagePlant(plantsData.slice(0,12));
            setNumberOfPages(Math.ceil(plantsData.length/12));
        });
        fetch(`http://localhost:8071/plants/outOfCategory/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            method: "GET"
        }).then(response => {
            if(response.status === 200) return response.json();
        }).then(plantsData => {
            setAllPlantsOutOfCategory(plantsData);
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
            if(response.status === 200) selectCategory(selectedCategory.id,selectedCategory.name,selectedCategory.description);
        }); 
        setSelectedPlantId('');
    }

    function deletePlantFromCategory(plantId,categoryId) {
        console.log("id rosliny "+plantId+" | id kategorii"+categoryId);
        fetch(`http://localhost:8071/categories/deletePlant/${plantId}/${categoryId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            method: "POST"
        }).then(response => {
            if(response.status === 200) selectCategory(selectedCategory.id,selectedCategory.name,selectedCategory.description);
        }); 
        setSelectedPlantId('');
    }

    const handleChangeSelectedPlant = (event) => {    
        setSelectedPlantId(event.target.value);
        console.log(selectedPlantId);
      };

    const handleNextPage = (event,value) => {    
        console.log(value*3);
        setPagePlant(plants.slice((value-1)*12,value*12));
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
                        <React.Fragment key={index}><Button variant="outlined" color="primary" onClick={() => selectCategory(category.id, category.name, category.description)}>
                        <Box sx={{ fontFamily: 'Abhaya Libre' }}>
                            {category.name}
                        </Box>
                        </Button>{"\xa0"}</React.Fragment>
                    ) : <></>}
            </div>

            {/* Dodawanie do kat */}
            <div style={{ margin: "1em", width: "300px" }}>
                <Paper>
                    <RadioGroup row aria-label="position" value={radioValue} name="position" defaultValue="top" style={{padding:16}} onChange={handleRadioChange}>
                        <FormControlLabel value="Add" control={<Radio color="primary" />} label="Dodaj" />
                        <FormControlLabel value="Delete" control={<Radio color="primary" />} label="Usuń" />
                    </RadioGroup>
                    <FormControl className={classes.formControl}>
                        <InputLabel>label</InputLabel>
                        {radioValue==="Add" ? <Select value={selectedPlantId} onChange={handleChangeSelectedPlant}>
                            {allPlantsOutOfCategory ? allPlantsOutOfCategory.map((plant,index) =>
                                <MenuItem key={index} value={plant.id}>{plant.name}</MenuItem>
                            ) : <MenuItem value=''>Nie wybrano</MenuItem>}
                            <MenuItem value=''>Nie wybrano</MenuItem>
                        </Select> :
                        <Select value={selectedPlantId} onChange={handleChangeSelectedPlant}>
                            {plants ? plants.map((plant,index) =>
                                <MenuItem key={index} value={plant.id}>{plant.name}</MenuItem>
                            ) : <MenuItem value=''>Nie wybranoo</MenuItem>}
                            <MenuItem value=''>Nie wybranoo</MenuItem>
                        </Select>}
                    </FormControl>
                    <Typography align="left" style={{padding:16}}>
                        {selectedCategory.id===0 ? <><font color="grey">Wybierz kategorię</font></> : 
                        <>{"\xa0"}{radioValue==="Add" ? <>do</> : <>z</> } kategorii <font color="green">{selectedCategory.name} </font></>}                        
                    </Typography>
                    {selectedCategory.id===0 || selectedPlantId==="" ? <>{"\xa0\xa0\xa0"}<Button variant="contained" color="primary" disabled>
                        <Box sx={{ fontFamily: 'Abhaya Libre' } } onClick={() => addPlantToCategory(selectedPlantId,selectedCategory.id)}>
                        Zatwierdź
                        </Box> 
                    </Button> {selectedPlantId==="" ? <>Nie wybrano rosliny</> : <></>} <br/> <br/></> :
                        <>{"\xa0\xa0\xa0"}<Button variant="contained" color="primary">
                        {radioValue==="Add" ? <Box sx={{ fontFamily: 'Abhaya Libre' } } onClick={() => addPlantToCategory(selectedPlantId,selectedCategory.id)}>
                        Zatwierdź
                        </Box> : <Box sx={{ fontFamily: 'Abhaya Libre' } } onClick={() => deletePlantFromCategory(selectedPlantId,selectedCategory.id)}>
                        Zatwierdź
                        </Box> }
                    </Button>  <br/> <br/></>}
                </Paper>
            </div>

            
            {/*  */}
        
            <div style={{ margin: "5em" }}>
                <Pagination count={numberOfPages} page={pagePlant} onChange={handleNextPage} />
                <br/>
                <Typography variant="h5" className={classes.title}>
                    <Box sx={{ fontFamily: 'Abhaya Libre' }}>{selectedCategory.name}</Box>
                </Typography>
                <Typography className={classes.title}>
                    <Box sx={{ fontFamily: 'Abhaya Libre' }}>{selectedCategory.description}</Box><br/>
                </Typography>
                <Grid container spacing={2}>
                {pagePlant ? pagePlant.map((plant, index) =>
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
                                <Typography gutterBottom variant="h6" component="h2">
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
                <br/>
                <Pagination count={numberOfPages} page={pagePlant} onChange={handleNextPage} />
                
            </div> 
            <br/><br/><br/><br/><br/><br/>
        </>
    );
};

export default Dashboard;