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
import { Box, CssBaseline, Toolbar, Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';


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
}));

const Dashboard = () => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [plants, setPlants] = useState(null);

    const theme = createTheme({
        palette: {
          primary: green,
        },
      });

        //Do dropzone
        const classes = useStyles();
        const [loading, setLoading] = React.useState(false);
        const [success, setSuccess] = React.useState(false);
        const [file,setFile] = React.useState(null);
        const [preview,setPreview] = React.useState();
        const [precent,setPrecent] = React.useState(0);
        const [downloadUri, setDownloadUri] = React.useState();

        const buttonClassname = clsx({
            [classes.buttonSuccess]: success,
          });

        
        const onDrop=React.useCallback((acceptedFiles) => {
            console.log(acceptedFiles);
            setFile(acceptedFiles[0])
            const previewUrl = URL.createObjectURL(acceptedFiles[0]);
            setPreview(previewUrl);
        },[]);
    
        const {getRootProps,getInputProps} = useDropzone({multiple:false,onDrop});
    
        const {ref,...rootProps} = getRootProps()

        const uploadFile = async() => {
            try{
                setLoading(true)
                const formData = new FormData();
                formData.append("file",file)
                const API_URL = "http://localhost:8071/plants/imageTest"
                const response = await axios.put(API_URL,formData,{
                    onUploadProgress:(ProgressEvent)=>{
                        const percentCompleted = (Math.round(ProgressEvent.loaded * 100)/ProgressEvent.total);
                        setPrecent(percentCompleted);
                    }
                });
                setDownloadUri(response.data.fileDownloadUri)
                setLoading(false)
                setSuccess(true)
            }catch(err){
                alert(err.message)
            }
        };
    
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
        });
    },[]);

    function createPlant() {
        console.log("test");
        fetch("http://localhost:8071/plants/test", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            method: "post"
        }).then(response => {
            return response.json();
        }).then(plant => {
            console.log(plant);
            window.location.href = `/plant/${plant.id}`;
        });
    }

    function goToPlantDetailsPage() {

    }



    return (
        <>
            <CssBaseline />
            <AppBar position="static" classes={{root: classes.appBarColor}}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        <Box sx={{ fontFamily: 'Abhaya Libre' }}>Zalogowany uytkownik</Box>
                    </Typography>
                    <Typography>
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
                    <Box sx={{ fontFamily: 'Abhaya Libre' } } onClick={() => window.location.href = `/addPlant`}>
                        Dodaj kategorię
                    </Box>
                </Button>
            </ThemeProvider>
            </div>
            
            <br/>

            <div style={{ margin: "5em" }}>
                <Grid container spacing={2}>
                {plants ? plants.map((plant, index) =>
                <Grid container item sm={3} spacing={0}>
                    <Card className={classes.root}>
                        <CardActionArea onClick={() => window.location.href = `/plant/${plant.id}`}>
                            <CardMedia 
                            className={classes.media}
                            image={plant.imagePath}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    <Box sx={{ fontFamily: 'Abhaya Libre' }}>
                                        {plant.name}
                                    </Box>
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
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