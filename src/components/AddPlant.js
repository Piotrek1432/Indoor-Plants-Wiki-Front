import React from 'react';
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
import clsx from 'clsx';
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

const AddPlant = () => {
    const classes = useStyles();
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [plants, setPlants] = useState(null);
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [file,setFile] = React.useState(null);
    const [preview,setPreview] = React.useState();
    const [precent,setPrecent] = React.useState(0);
    const [downloadUri, setDownloadUri] = React.useState();
    const [openDialog, setOpenDialog] = React.useState(false);
    const [openBadDialog, setOpenBadDialog] = React.useState(false);
    

    const buttonClassname = clsx({
        [classes.buttonSuccess]: success,
      });

    const onDrop=React.useCallback((acceptedFiles) => {
        console.log(acceptedFiles);
        setFile(acceptedFiles[0])
        const previewUrl = URL.createObjectURL(acceptedFiles[0]);
        setPreview(previewUrl);
    },[]);

    const {getRootProps,getInputProps} = useDropzone({multiple:false,onDrop,accept: {
        'image/png': ['.png','.jpg','.jpeg'],
      }});

    const {ref,...rootProps} = getRootProps()

    //Form fields
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

    const handleChange = (e) => {
        setInputs((prevState)=>({
            ...prevState,
            [e.target.name] : e.target.value
        }))
    }

    const handleChangeName = (e) => {
        setInputs((prevState)=>({
            ...prevState,
            [e.target.name] : e.target.value.toUpperCase()
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
                    fetch(process.env.REACT_APP_SPRING_URL+"/wiki/createNewPlant", {
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
                fetch(process.env.REACT_APP_SPRING_URL+"/wiki/createNewPlant", {
                        method: "POST",
                        headers: {
                            'Content-Type': "application/json",
                            "Authorization": `Bearer ${jwt}`
                        },
                        body: JSON.stringify(inputs)
                    }).then(response => {
                        if(response.status === 200) setOpenDialog(true);
                        else setOpenBadDialog(true);
                });
            }           
        }catch(err){
            alert(err.message)
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        window.location.href= "loggedInUser"
      };

      const handleCloseBadDialog = () => {
        setOpenBadDialog(false);
        window.location.href= "loggedInUser"
      };

    return (
        <>
            <CssBaseline />
            <AppBar position="static" classes={{root: classes.appBarColor}}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title} component={'span'}>
                        <Box sx={{ fontFamily: 'Abhaya Libre' }}>Dodaj roślinę</Box>
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
                    <TextField inputProps={{ maxLength: 25 }} required name="name" value={inputs.name} label="Nazwa rośliny" onChange={handleChangeName}/><br/><br/>
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
                                    alt='Nieprawidłowy typ pliku. Akceptowane rozszerzenie to .jpg, .jpeg i .png'/>
                                <Divider />
                                {file && (<>
                                    <Grid container style={{marginTop:16}} alignItems="center">
                                        <Grid item xs={10}>
                                            {file && <Typography variant="body">{file.name}</Typography>}
                                        </Grid>
                                    </Grid>
                                </>)}
                            </Grid>
                        </Grid>
                    </Paper>
                    </Container>
                    {/* ------------ */}
                    <br/><br/><TextField inputProps={{ maxLength: 600 }} name="description" multiline minRows={4} fullWidth variant="filled" value={inputs.description} label="Krótki opis" onChange={handleChange} />
                    <br/><br/><TextField inputProps={{ maxLength: 300 }} name="positiveQualities" multiline minRows={3} fullWidth variant="filled" value={inputs.positiveQualities} label="Pozytywne cechy" onChange={handleChange} />
                    <br/><br/><TextField inputProps={{ maxLength: 300 }} name="insolation" multiline minRows={3} fullWidth variant="filled" value={inputs.insolation} label="Informacje o wymaganym nasłonecznieniu" onChange={handleChange} />
                    <br/><br/><TextField inputProps={{ maxLength: 300 }} name="watering" multiline minRows={3} fullWidth variant="filled" value={inputs.watering} label="Częstotliwość nawadniania" onChange={handleChange} />
                    <br/><br/><TextField inputProps={{ maxLength: 500 }} name="fertilization" multiline minRows={4} fullWidth variant="filled" value={inputs.fertilization} label="Informacje o nawożeniu i podłożu" onChange={handleChange} />
                    <br/><br/><TextField inputProps={{ maxLength: 500 }} name="badSignals" multiline minRows={4} fullWidth variant="filled" value={inputs.badSignals} label="Podatności i sygnały wymagające szczególnej uwagi" onChange={handleChange} />
                    <br/><br/>
                    {inputs.name && (<Button onClick={handleSubmit} variant="outlined">Wyślij do zatwierdzenia</Button> )}
                    {!inputs.name && (<><Button onClick={handleSubmit} variant="outlined" disabled>Wyślij do zatwierdzenia</Button> <font color="red">Wymagane jest podanie nazwy rośliny </font></>)}
                    {loading ? <CircularProgress size={68} className={classes.fabProgress}/> : <></>}
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
                    Twój wpis został wysłany do weryfikacji. Po zatwierdzeniu przez administratora dodana przez Ciebie roślina pojawi się na stronie
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openBadDialog}
                keepMounted
                onClose={handleCloseBadDialog}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{"Błąd!"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                    Wygląda na to, że roślina o takiej nazwie jest już w bazie
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseBadDialog} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AddPlant;