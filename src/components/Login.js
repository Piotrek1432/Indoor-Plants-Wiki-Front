import React, { useState } from 'react';
import { useLocalState } from '../util/UseLocalStorage';
import { Box, CssBaseline, TextField, Toolbar, Typography } from '@material-ui/core';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [jwt, setJwt] = useLocalState("", "jwt");

    function sendLoginRequest() {
        const reqBody = {
            username: username,
            password: password
        };
        
      fetch(process.env.REACT_APP_SPRING_URL+'/api/auth/login',{
      headers: {
        "Content-Type": "application/json"
      },
      method: "post",
      body: JSON.stringify(reqBody)
      })
        .then((response) => {
            if (response.status === 200) return response.json();
            else return Promise.reject("Błędne dane logowania");
        })
        .then(response => {
            setJwt(response.jwt);
            console.log(response.role);
            if(response.role==="ROLE_ADMIN") window.location.href= "adminPanel";
            else window.location.href= "loggedInUser";
        })
        .catch((message) => {
            alert(message);
        });
        
    }

    return (
        <><br/><br/>
        <div style={{ margin: "auto",
            width: "400px",
            border: "3px solid green",
            borderRadius: "10px",
            padding: "10px" }}>
            <Typography variant="h3" component={'span'}>
                        <Box sx={{ fontFamily: 'Abhaya Libre' }}>Logowanie</Box>
            </Typography>
            <div style={{ margin: "1em" }}>
                <label htmlFor="username">Login</label><br/>
                <Input required type="login" id="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
            </div>
            <div style={{ margin: "1em" }}>
                <label htmlFor="password">Hasło</label><br/>
                <Input
                    variant="filled"
                    id="password"
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div style={{ margin: "1em" }}>
                <Button variant="outlined" id="submit" type="button"size="lg" onClick={() => sendLoginRequest()}>Zaloguj</Button>
            </div>
        </div>
        </>
    );
};

export default Login;