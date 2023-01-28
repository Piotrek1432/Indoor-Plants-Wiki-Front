import React, { useState } from 'react';
import { useLocalState } from '../util/UseLocalStorage';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import { Box, Typography } from '@material-ui/core';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';

const isNumberRegx = /\d/;
const spacialCharacterRegx = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [passwordRepeatFocused, setPasswordRepeatFocused] = useState(false);
    const [passwordValidity, setPasswordValidity] = useState({
        minChar: null,
        number: null,
        specialChar: null
    });
    const [showPassword, setShowPassword] = useState(false);
    const {REACT_APP_SPRING_URL} = process.env;

    const onPasswordChange = password =>{
        setPassword(password);
        setPasswordValidity({
            minChar: password.length >= 8 ? true : false,
            number: isNumberRegx.test(password) ? true : false,
            specialChar: spacialCharacterRegx.test(password) ? true : false
        })
    }

    const onPasswordRepeatChange = passwordRepeat =>{
        setPasswordRepeat(passwordRepeat);
    }

    function sendRegisterRequest() {
        const reqBody = {
            username: username,
            password: password
        };
        
      fetch(process.env.REACT_APP_SPRING_URL+'/api/auth/register',{
      headers: {
        "Content-Type": "application/json"
      },
      method: "post",
      body: JSON.stringify(reqBody)
      })
        .then((response) => {
            if (response.status === 200) return response.json();
            else if (response.status === 400) return Promise.reject("Ten login jest już zajęty");
            else return Promise.reject("Błąd lub niedostępność serwera");
        })
        .then(response => {
            setJwt(response.jwt);
            window.location.href= "loggedInUser";
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
                        <Box sx={{ fontFamily: 'Abhaya Libre' }}>Rejestracja</Box>
            </Typography>
            <div style={{ margin: "1em" }}>
                <label htmlFor="password">Login/Nazwa użytkownika</label><br/>
                <Input required type="login" id="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
            </div>
            <div style={{ margin: "1em" }}>
                <label htmlFor="password">Hasło</label><br/>
                <Input
                    variant="filled"
                    id="password"
                    type='password'
                    value={password}
                    onFocus={ () => setPasswordFocused(true)}
                    onChange={(e) => onPasswordChange(e.target.value)}/>
            </div>
            <div style={{ margin: "1em" }}>
                <label htmlFor="password">Powtórz hasło</label><br/>
                <Input
                    variant="filled"
                    id="passwordRepeat"
                    type='password'
                    value={passwordRepeat}
                    onFocus={ () => setPasswordRepeatFocused(true)}
                    onChange={(e) => onPasswordRepeatChange(e.target.value)}/>
            </div>
            {passwordRepeatFocused && password!==passwordRepeat ? <><font color="red">Hasła nie są takie same</font></> : <></>}
            {passwordFocused && <PasswordStrengthIndicator validity={passwordValidity} />}
            { passwordValidity.minChar === true  && passwordValidity.number === true && passwordValidity.specialChar === true && password===passwordRepeat ? 
                <div style={{ margin: "1em" }}><Button variant="outlined" id="submit" type="button"size="lg" onClick={() => sendRegisterRequest()}>Zarejestruj konto</Button></div>
                :
                <div style={{ margin: "1em" }}><Button variant="outlined" disabled id="submit" type="button"size="lg" onClick={() => sendRegisterRequest()}>Zarejestruj konto</Button></div>
            }
        </div>
        </>
    );
}

export default Register;