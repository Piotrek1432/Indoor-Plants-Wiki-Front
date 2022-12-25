import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalState } from '../util/UseLocalStorage';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [jwt, setJwt] = useLocalState("", "jwt");

    function sendLoginRequest() {
        const reqBody = {
            username: username,
            password: password
        };
        
      fetch('http://localhost:8071/api/auth/login',{
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
            setJwt(response.answer);
            console.log(response.role);
            if(response.role==="ROLE_ADMIN") window.location.href= "adminPanel";
            else window.location.href= "dashboard";
        })
        .catch((message) => {
            alert(message);
        });
        
    }

    return (
        <>
            <h1 style={{ margin: "1em" }}>Logowanie</h1>
            <div style={{ margin: "1em" }}>
                <label htmlFor="username">Login</label><br/>
                <input type="login" id="username" value={username}
                onChange={(e) => setUsername(e.target.value)}/>
            </div>
            <div style={{ margin: "1em" }}>
                <label htmlFor="password">Hasło</label><br/>
                <input type="haslo" id="password"value={password}
                onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div style={{ margin: "1em" }}><button id="submit" type="button"size="lg" onClick={() => sendLoginRequest()}>Zaloguj</button></div>
        </>
    );
};

export default Login;