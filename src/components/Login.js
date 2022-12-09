import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalState } from '../util/UseLocalStorage';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

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
        })
        .then(response => {
            if(response)setJwt(response.answer);
            navigate("/dashboard");
        });
        
    }

    return (
        <>
            <div>
                <label htmlFor="username">Login</label>
                <input type="login" id="username" value={username}
                onChange={(e) => setUsername(e.target.value)}/>
            </div>
            <div>
                <label htmlFor="password">Hasło</label>
                <input type="haslo" id="password"value={password}
                onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div><button id="submit" type="button"size="lg" onClick={() => sendLoginRequest()}>Wyślij</button></div>
        </>
    );
};

export default Login;