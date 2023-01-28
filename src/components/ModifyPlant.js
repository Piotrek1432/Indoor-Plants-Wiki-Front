import React, { useEffect } from 'react';
import { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { Box, CssBaseline, TextField, Toolbar, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import { useLocalState } from '../util/UseLocalStorage';
import Container from "@material-ui/core/Container";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { green } from '@material-ui/core/colors';
import { useDropzone } from 'react-dropzone';
import RootRef from '@material-ui/core/RootRef';
import Fab from '@material-ui/core/Fab';
import CloudUpload from '@material-ui/icons/CloudUpload';
import clsx from 'clsx';
import { LinearProgress } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
          },
      },
    palette: {
        primary: green
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
        objectFit: "cover"
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

const ModifyPlant = () => {
    const plantId = window.location.href.split("/modifyPlant/")[1];
    const classes = useStyles();
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [plants, setPlants] = useState(null);
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [file,setFile] = React.useState(null);
    const [preview,setPreview] = React.useState();
    const [precent,setPrecent] = React.useState(0);
    const [downloadUri, setDownloadUri] = React.useState();
    const [plant, setPlant] = useState(null);    
    const [openDialog, setOpenDialog] = React.useState(false);


    const [inputs, setInputs] = useState({
        name: "",
        description: "",
        imageUri: "",
        positiveQualities: "",
        insolation: "",
        watering: "",
        fertilization: "",
        badSignals: ""
    });

    useEffect(() => {
        fetch(process.env.REACT_APP_SPRING_URL+`/plants/${plantId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            method: "GET"
        }).then(response => {
            if(response.status === 200) return response.json();
        }).then(plantData => {
            setPlant(plantData);
            inputs.name = plantData.name;
            inputs.description = plantData.description;
            inputs.positiveQualities = plantData.positiveQualities;
            inputs.insolation = plantData.insolation;
            inputs.watering = plantData.watering;
            inputs.fertilization = plantData.fertilization;
            inputs.badSignals = plantData.badSignals;
            inputs.imageUri = plantData.imagePath;
            setPreview(plantData.imagePath);
        });
    }, [])

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

    //Form fields


    const handleChange = (e) => {
        setInputs((prevState)=>({
            ...prevState,
            [e.target.name] : e.target.value
        }))
    }

    let config = {
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
      }

    const handleSubmit = async() => {
        try{
            setLoading(true)
            const formData = new FormData();
            formData.append("file",file)
            const API_URL = process.env.REACT_APP_SPRING_URL+`/wiki/addImage/${inputs.name}`
            if(file){
                const response = await axios.put(API_URL,formData,config,{
                    onUploadProgress:(ProgressEvent)=>{
                        const percentCompleted = (Math.round(ProgressEvent.loaded * 100)/ProgressEvent.total);
                        setPrecent(percentCompleted);
                    }
                }).then(response => {
                    setDownloadUri(response.data.fileDownloadUri);
                    setLoading(false);
                    setSuccess(true);
                    if(response.data.fileDownloadUri !== "")inputs.imageUri = response.data.fileDownloadUri;
                    else inputs.imageUri = process.env.REACT_APP_SPRING_URL+"/plants/test/default.jpg";
                    console.log(inputs);
                    console.log(response.data.fileDownloadUri);
                    fetch(process.env.REACT_APP_SPRING_URL+`/wiki/modifyPlant/${plantId}`, {
                        method: "POST",
                        headers: {
                            'Content-Type': "application/json",
                            "Authorization": `Bearer ${jwt}`
                        },
                        body: JSON.stringify(inputs)
                    }).then(response => {
                        if(response.status === 200) setOpenDialog(true);
                });
                });
            }else{
                fetch(process.env.REACT_APP_SPRING_URL+`/wiki/modifyPlant/${plantId}`, {
                        method: "POST",
                        headers: {
                            'Content-Type': "application/json",
                            "Authorization": `Bearer ${jwt}`
                        },
                        body: JSON.stringify(inputs)
                    }).then(response => {
                        if(response.status === 200) setOpenDialog(true);
                });
            }
            
            
        }catch(err){
            alert(err.message)
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        window.location= "http://localhost:3000/dashboard"
      };

    return (
        <>
            <CssBaseline />
            <AppBar position="static" classes={{root: classes.appBarColor}}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title} component={'span'}>
                        <Box sx={{ fontFamily: 'Abhaya Libre' }}>Zmodyfikuj wpis</Box>
                    </Typography>
                    <Typography component={'span'}>
                        <Button color="inherit" onClick={() => {setJwt("");
                        window.location.href = "/"
                    }}>Wyloguj</Button>
                    </Typography>
                </Toolbar>
            </AppBar>
            <br/>  

            <form className='classes.root'>
                <div style={{ margin: "10em" , marginTop: "3em"}}>
                <Typography variant="h6" className={classes.title} component={'span'}>
                        <Box sx={{ fontFamily: 'Abhaya Libre' }}>{inputs.name}</Box>
                    </Typography>
                    {/* adding image */}
                    <Container maxWidth="xl">
                    <Paper elevation={10} >
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography align="center" style={{padding:16}}>
                                    Dodaj zdjęcie
                                </Typography>
                                <Divider />
                            </Grid>

                            <Grid item xs={6} style={{padding:16}}>
                                <RootRef rootRef={ref}>
                                    <Paper {...rootProps} elevation={0} className={classes.dropzoneContainer} >
                                    <p>Upuść zdjęcie które chcesz dodać<br/>
                                        Obsługiwane rozszerzenia to .jpg, .jpeg, .png
                                    </p>
                                    </Paper>
                                </RootRef>
                            </Grid>

                            <Grid item xs={6} style={{padding:16}}>
                                <Typography align="center" variant="subtitle1" >
                                    Podgląd
                                </Typography>
                                <img
                                    onLoad={()=>URL.revokeObjectURL(preview)} 
                                    className={classes.preview}
                                    src={preview || "https://via.placeholder.com/250"}
                                    alt='some value'/>
                                <Divider />
                                {file && (<>
                                    <div className={classes.wrapper}>
                                        <Fab
                                            aria-label="save"
                                            color="primary"
                                            className={buttonClassname}
                                        >
                                            {success ? <CheckIcon /> : <CloudUpload />}
                                        </Fab>
                                        {loading && <CircularProgress size={68} className={classes.fabProgress} />}
                                    </div>
                                    <Grid container style={{marginTop:16}} alignItems="center">
                                        <Grid item xs={10}>
                                            {file && <Typography variant="body">{file.name}</Typography>}
                                            {loading && (<div>
                                                <LinearProgress variant="detarminate" value={100}/>
                                                <div style={{display:'flex',alignItems:'center', justifyContent:'center'}}>
                                                    <Typography variant="body">100%</Typography>
                                                </div>
                                            </div>)}
                                        </Grid>
                                    </Grid>
                                </>)}

                                {success && (
                                    <Typography>
                                        <a href={downloadUri} target="_blank">asd</a>
                                    </Typography>
                                )}

                            </Grid>
                        </Grid>
                    </Paper>
                    </Container>
                    {/* ------------ */}
                    <br/><br/><TextField inputProps={{ maxLength: 600 }} name="description" multiline minRows={4} fullWidth variant="filled" value={inputs.description} label="Krótki opis" onChange={handleChange} />
                    <br/><br/><TextField inputProps={{ maxLength: 300 }} name="positiveQualities" multiline minRows={3} fullWidth variant="filled" value={inputs.positiveQualities} label="Pozytywne cechy" onChange={handleChange} />
                    <br/><br/><TextField inputProps={{ maxLength: 300 }} name="insolation" multiline minRows={3} fullWidth variant="filled" value={inputs.insolation} label="Informacje o wymaganym nasłonecnieniu" onChange={handleChange} />
                    <br/><br/><TextField inputProps={{ maxLength: 300 }} name="watering" multiline minRows={3} fullWidth variant="filled" value={inputs.watering} label="Częstotliwość nawadniania" onChange={handleChange} />
                    <br/><br/><TextField inputProps={{ maxLength: 500 }} name="fertilization" multiline minRows={4} fullWidth variant="filled" value={inputs.fertilization} label="Informacje o nawożeniu i podłożu" onChange={handleChange} />
                    <br/><br/><TextField inputProps={{ maxLength: 500 }} name="badSignals" multiline minRows={4} fullWidth variant="filled" value={inputs.badSignals} label="Złe sygnały wymagające szczególnej uwagi" onChange={handleChange} />
                    <br/><br/>
                    {inputs.name && (<Button onClick={handleSubmit} variant="outlined">Wyślij do zatwierdzenia</Button> )}
                    {!inputs.name && (<><Button onClick={handleSubmit} variant="outlined" disabled>Wyślij do zatwierdzenia</Button> <font color="red">Wymagane jest podanie nazwy rośliny </font></>)}
                </div>
            </form>

            <Dialog
                open={openDialog}
                keepMounted
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{"Dzięki!"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                    Twoja modyfikacja została wysłana do weryfikacji. Po zatwierdzeniu przez administratora zmiany któych dokonałeś pojawią się na stronie
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ModifyPlant;