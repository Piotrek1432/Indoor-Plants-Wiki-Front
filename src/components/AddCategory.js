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
import Slide from '@material-ui/core/Slide';

const useStyles = makeStyles((theme) => ({
    title: {
      flexGrow: 1,
    },
}));

const AddCategory = () => {
    const classes = useStyles();
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [openDialog, setOpenDialog] = React.useState(false);
    const [openBadDialog, setOpenBadDialog] = React.useState(false);

    const [inputs, setInputs] = useState({
        name: "",
        description: "",
    });

    const handleName = (e) => {
        setInputs((prevState)=>({
            ...prevState,
            [e.target.name] : e.target.value.toUpperCase()
        }))
    }

    const handleDesc = (e) => {
        setInputs((prevState)=>({
            ...prevState,
            [e.target.name] : e.target.value
        }))
    }

    function handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();
        console.log( 'Nazwa:', inputs.name, 'opis: ', inputs.description); 
        fetch("http://localhost:8071/categories", {
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

    const handleCloseDialog = () => {
        setOpenDialog(false);
        window.location.href= "dashboard"
      };

    const handleCloseBadDialog = () => {
        setOpenBadDialog(false);
        window.location.href= "dashboard"
      };

    return (
        <>
            <CssBaseline />
            <AppBar position="static" classes={{root: classes.appBarColor}}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title} component={'span'}>
                        <Box sx={{ fontFamily: 'Abhaya Libre' }}>Dodaj kategorię</Box>
                    </Typography>
                    <Typography component={'span'}>
                        <Button color="inherit" onClick={() => {setJwt("");
                        window.location.href = "/"
                    }}>Wyloguj</Button>
                    </Typography>
                </Toolbar>
            </AppBar>
            <br/>

            <form className='classes.root' onSubmit={handleSubmit}>
                <div style={{ margin: "10em" , marginTop: "3em", marginRight: "70em"}}>
                    <TextField style={{ textTransform: 'uppercase'}} required name="name" value={inputs.name} label="Nazwa rośliny" onChange={handleName}/><br/><br/>
                    <TextField inputProps={{ maxLength: 255 }} name="description" multiline minRows={3} fullWidth variant="filled" value={inputs.description} label="Krótki opis" onChange={handleDesc} /><br/><br/>
                    <Button type="submit" variant="outlined">Dodaj kategorię</Button>
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
                    Pomyślnie utworzono nową katgorię
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
                    Wygląda na to, że kategoria o takiej nazwie jest już w bazie
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

export default AddCategory;