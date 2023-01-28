import React from 'react';
import { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { Box, CssBaseline, TextField, Toolbar, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import { useLocalState } from '../util/UseLocalStorage';
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
        fetch(process.env.REACT_APP_SPRING_URL+"/categories", {
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
                    <TextField inputProps={{ maxLength: 25 }} style={{ textTransform: 'uppercase'}} required name="name" value={inputs.name} label="Nazwa rośliny" onChange={handleName}/><br/><br/>
                    <TextField inputProps={{ maxLength: 255 }} name="description" multiline minRows={3} fullWidth variant="filled" value={inputs.description} label="Krótki opis" onChange={handleDesc} /><br/><br/>
                    {inputs.name && (<Button onClick={handleSubmit}  variant="outlined">Dodaj kategorię</Button> )}
                    {!inputs.name && (<><Button  variant="outlined" disabled>Dodaj kategorię</Button> <font color="red">Wymagane jest podanie nazwy kategorii </font></>)}
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