import React, { useEffect, useState } from 'react';
import { useLocalState } from '../util/UseLocalStorage';
import { Box, CssBaseline, Paper, Toolbar, Typography,TextField } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import { makeStyles  } from '@material-ui/core/styles';
import Container from "@material-ui/core/Container";
import Divider from '@material-ui/core/Divider';

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
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
      },
}));
const PlantView = () => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const plantId = window.location.href.split("/plant/")[1];
    const [plant, setPlant] = useState(null);
    const [signaturesModel, setSignaturesModel] = useState(null);
    const classes = useStyles();
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState(null);

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
        });
        fetch(process.env.REACT_APP_SPRING_URL+`/plants/readSignatures/${plantId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            method: "GET"
        }).then(response => {
            if(response.status === 200) return response.json();
        }).then(signaturesModel => {
            setSignaturesModel(signaturesModel);
            console.log(signaturesModel);
        });
        fetch(process.env.REACT_APP_SPRING_URL+`/comment/readAllComments/${plantId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            method: "GET"
        }).then(response => {
            if(response.status === 200) return response.json();
        }).then(plantComments => {
            setComments(plantComments);
            console.log(plantComments);
        });
    }, [])

    function goToLoginPage() {
        window.location = "http://localhost:3000/login";
    }

    function goToRegistrationPage() {
        window.location = "http://localhost:3000/register";
    }
    const handleChange = (e) => {
        setComment(e.target.value);
    }

    const handleSubmit = (event,value) => { 
        const reqBody = {
            comment: comment
        };   
        fetch(process.env.REACT_APP_SPRING_URL+`/comment/addNewComment/${plantId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            method: "POST",
            body: JSON.stringify(reqBody)
        }).then(response => {
            if(response.status === 200) {
                fetch(process.env.REACT_APP_SPRING_URL+`/comment/readAllComments/${plantId}`, {
                    headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${jwt}`
                    },
                    method: "GET"
                }).then(response => {
                if(response.status === 200) return response.json();
                }).then(plantComments => {
                    setComments(plantComments);
                });
            }
        }); 
      };

    return (
        <>
            <CssBaseline />
            <AppBar position="static" classes={{root: classes.appBarColor}}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title} component={'span'}>
                        <Box sx={{ fontFamily: 'Abhaya Libre' }}>Baza roślin domowych</Box>
                    </Typography>
                    {jwt!=="" ? <Typography component={'span'}>
                        <Button color="inherit" onClick={() => {setJwt("");
                        window.location.href = "/"
                    }}>Wyloguj</Button>
                    </Typography> : <Typography component={'span'}>
                        <Button sx={{ fontFamily: 'Abhaya Libre' }} color="inherit" onClick={() => goToLoginPage()}>Zaloguj</Button>
                        <Button color="inherit" onClick={() => goToRegistrationPage()}>Zarejestruj</Button>
                    </Typography> }
                </Toolbar>
            </AppBar>
            {plant ? (
                <><Container maxWidth="md"><Paper style={{ margin: "4em" }}>
                    <Typography variant="h4" align="center" style={{padding:8, fontFamily: 'Abhaya Libre', }}>
                        {plant.name} {jwt ?(<Button type="submit" variant="outlined" onClick={() => window.location.href = `/modifyPlant/${plant.id}`}>Zmodyfikuj wpis</Button>) : (<></>)}
                    </Typography>
                    <Typography align="center" style={{padding:1, fontSize:"12px", fontFamily: 'Abhaya Libre', }}>
                        {signaturesModel!==null ? <font  color="grey">Autor: {signaturesModel.authorName}<br/>Utworzono: {signaturesModel.createdOn}<br/>Ostatnia modyfikacja: {signaturesModel.updatedOn}</font> : <></> }
                    </Typography>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <img style={{ margin: "1em", marginLeft: "3em", objectFit: "cover" }} height={250} width={250} src={plant.imagePath} alt='Brak zdjęcia'/>
                                </td>
                                <td>
                                    <Typography variant="h5" align="center" style={{padding:10, fontFamily: 'Abhaya Libre'}}>
                                        Opis
                                    </Typography>
                                    <Typography align="justify" style={{padding:10, fontFamily: 'Abhaya Libre'}}>
                                        {plant.description}
                                    </Typography>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Typography variant="h5" align="center" style={{padding:10, fontFamily: 'Abhaya Libre'}}>
                                        Zalety rośliny
                                    </Typography>
                                    <Typography align="justify" style={{padding:16, fontFamily: 'Abhaya Libre'}}>
                                        {plant.positiveQualities}
                                    </Typography>
                                </td>
                                <td>
                                    <Typography variant="h5" align="center" style={{padding:10, fontFamily: 'Abhaya Libre'}}>
                                        Wymagane nasłonecznienie
                                    </Typography>
                                    <Typography align="justify" style={{padding:16, fontFamily: 'Abhaya Libre'}}>
                                        {plant.insolation}
                                    </Typography>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Typography variant="h5" align="center" style={{padding:10, fontFamily: 'Abhaya Libre'}}>
                                        Podlewanie
                                    </Typography>
                                    <Typography align="justify" style={{padding:16, fontFamily: 'Abhaya Libre'}}>
                                        {plant.watering}
                                    </Typography>
                                </td>
                                <td>
                                    <Typography variant="h5" align="center" style={{padding:10, fontFamily: 'Abhaya Libre'}}>
                                        Rodzaj podłoża i nawożenie
                                    </Typography>
                                    <Typography align="justify" style={{padding:16, fontFamily: 'Abhaya Libre'}}>
                                        {plant.fertilization}
                                    </Typography>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2">
                                    <Typography variant="h5" align="center" style={{padding:10, fontFamily: 'Abhaya Libre'}}>
                                        Podatności i sygnały wymagające szczególnej uwagi
                                    </Typography>
                                    <Typography align="justify" style={{padding:16, fontFamily: 'Abhaya Libre'}}>
                                        {plant.badSignals}
                                    </Typography>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Paper></Container>
                {jwt ? <Container maxWidth="md">
                    <Paper style={{ margin: "4em" }}>
                        <Typography variant="h6" align="left" style={{padding:8, fontFamily: 'Abhaya Libre', }}>
                            Dodaj komentarz:
                        </Typography>
                        <TextField inputProps={{ maxLength: 255 }} name="newComment" multiline minRows={3} fullWidth variant="filled" value={comment} label="Wpisz komentarz" onChange={handleChange} /><br/><br/>
                        {comment==="" ? <Button style={{padding:1, fontFamily: 'Abhaya Libre', align: "right"}} variant="outlined" disabled>Wyślij</Button> :
                        <Button onClick={handleSubmit} style={{padding:1, fontFamily: 'Abhaya Libre', align: "right"}} variant="outlined">Wyślij</Button>}
                    </Paper>
                </Container> : <></>}
                <Container maxWidth="md">
                    <Paper style={{ margin: "4em" }}>
                        <Typography variant="h6" align="left" style={{padding:8, fontFamily: 'Abhaya Libre', }}>
                            Komentarze:
                        </Typography>
                        {comments ? comments.map((singleComment,index) =>
                            <React.Fragment key={index}>
                            <Typography  align="left" style={{padding:1, fontSize:"14px", fontFamily: 'Abhaya Libre', }}>
                            Autor: {singleComment.author.username}{"\xa0\xa0\xa0\xa0\xa0"} Data dodania: {singleComment.createdOn.slice(0, -7)}
                            </Typography>
                            <Typography  align="left" style={{padding:1, fontSize:"16px", fontFamily: 'Abhaya Libre' }}>
                            {singleComment.content}
                            </Typography>
                            <Divider /><br/>
                            </React.Fragment>
                        ): <></>}
                    </Paper>
                </Container>
                </>
            ) : (
                <></>
            )}
        </>
    );
};

export default PlantView;