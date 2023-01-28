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
import Pagination from '@material-ui/lab/Pagination';


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
        width:250,
        height:350
      },
  }));

const Homepage = () => {
    const classes = useStyles();
    const [plants, setPlants] = useState(null);
    const [categories, setCategories] = useState(null);
    const [pagePlant, setPagePlant] = React.useState(null);
    const [numberOfPages,setNumberOfPages] = useState(0);

    const [selectedCategory, setSelectedCategory] = useState({
        name: "Wszystkie rośliny",
        description: "",
        id: 0
    })

    function goToLoginPage() {
        window.location.href = "login";
    }

    function goToRegistrationPage() {
        window.location.href = "register";
    }

    useEffect(() => {
        console.log(process.env);
        fetch(process.env.REACT_APP_SPRING_URL+"/plants?sort=name", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "GET"
        }).then(response => {
            if(response.status === 200) return response.json();
        }).then(plantsData => {
            setPlants(plantsData);
            console.log(plantsData);
            setPagePlant(plantsData.slice(0,12));
            setNumberOfPages(Math.ceil(plantsData.length/12));
        });

        fetch(process.env.REACT_APP_SPRING_URL+"/categories", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "GET"
        }).then(response => {
            if(response.status === 200) return response.json();
        }).then(categoriesData => {
            setCategories(categoriesData);
        });
    },[]);

    function selectCategory(id,name, description) {
        setSelectedCategory(()=>({
            id: id,
            name: name,
            description: description
        }))
        console.log("Wybrana kategoria "+id);
        fetch(process.env.REACT_APP_SPRING_URL+`/plants/category/${id}`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "GET"
        }).then(response => {
            if(response.status === 200) return response.json();
        }).then(plantsData => {
            setPlants(plantsData);
            setPagePlant(plantsData.slice(0,12));
            setNumberOfPages(Math.ceil(plantsData.length/12));
        });
    }

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
                        <Box sx={{ fontFamily: 'Abhaya Libre' }}>Baza roślin domowych</Box>
                    </Typography>
                    <Typography component={'span'}>
                        <Button sx={{ fontFamily: 'Abhaya Libre' }} color="inherit" onClick={() => goToLoginPage()}>Zaloguj</Button>
                        <Button color="inherit" onClick={() => goToRegistrationPage()}>Zarejestruj</Button>
                    </Typography>
                </Toolbar>
            </AppBar>
            <br/>

            {/* categories: */}
            <div style={{ margin: "1em" }}>
                    <Typography variant="h6" className={classes.title} component={'span'}>
                        <Box sx={{ fontFamily: 'Abhaya Libre' }}>Kategorie: </Box>
                    </Typography>
                    <React.Fragment><Button variant="outlined" color="primary" onClick={() => window.location.href = "/"}>
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
                {pagePlant ? pagePlant.map((plant,index) =>
                <Grid key={index} container item sm={3} spacing={0}>
                    <Card className={classes.root}>
                        <CardActionArea onClick={() => window.location.href = `/plant/${plant.id}`}>
                            {plant.imagePath!=='' ? <CardMedia 
                            className={classes.media}
                            image={plant.imagePath}
                            title="plant image"
                            component='img'
                            /> : <CardMedia className={classes.media} image={process.env.REACT_APP_SPRING_URL+"/plants/test/default.jpg"} title="plant image" component='img'/> }
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
            <footer style={{textAlign: "center", padding: "2px", backgroundColor: "DarkGreen", color: "white"}}>
                <p>Autor: Piotr Jankowski</p>
                <p>Kontakt: <a style={{color: "yellow"}} href="mailto:piotrjankowski@example.com">piotrjankowski@example.com</a></p>
            </footer> 
        </>
    );
};

export default Homepage;