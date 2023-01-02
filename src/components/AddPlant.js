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
    const [inputs, setInputs] = useState({
        name: "",
        description: "",
        imageUri: ""
    });

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
            const API_URL = `http://localhost:8071/wiki/addImage/${inputs.name}`
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
                    else inputs.imageUri = "http://localhost:8071/plants/test/default.jpg";
                    console.log(inputs);
                    console.log(response.data.fileDownloadUri);
                    fetch("http://localhost:8071/wiki/createNewPlant", {
                        method: "POST",
                        headers: {
                            'Content-Type': "application/json",
                            "Authorization": `Bearer ${jwt}`
                        },
                        body: JSON.stringify(inputs)
                    })
                });
            }else{
                fetch("http://localhost:8071/wiki/createNewPlant", {
                        method: "POST",
                        headers: {
                            'Content-Type': "application/json",
                            "Authorization": `Bearer ${jwt}`
                        },
                        body: JSON.stringify(inputs)
                    })
            }
            
            
        }catch(err){
            alert(err.message)
        }
        // if(downloadUri !== "")inputs.imageUri = downloadUri;
        // else inputs.imageUri = "http://localhost:8071/plants/test/default.jpg";
        // console.log(inputs);
        // console.log(downloadUri);
        // fetch("http://localhost:8071/wiki/createNewPlant", {
        //     method: "POST",
        //     headers: {
        //         'Content-Type': "application/json",
        //         "Authorization": `Bearer ${jwt}`
        //     },
        //     body: JSON.stringify(inputs)
        // })
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
                    <TextField required name="name" value={inputs.name} label="Nazwa rośliny" onChange={handleChange}/><br/><br/>
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
                                    <p>Upuść zdjęcie które chcesz dodać</p>
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
                    <br/><br/><TextField name="description" multiline minRows={4} fullWidth variant="filled" value={inputs.description} label="Krótki opis" onChange={handleChange} />
                    <br/><br/>
                    {inputs.name && (<Button onClick={handleSubmit}>Wyślij do zatwierdzenia</Button> )}
                </div>
            </form>
        </>
    );
};

export default AddPlant;