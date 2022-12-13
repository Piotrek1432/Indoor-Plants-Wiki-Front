import React, { useState } from 'react';
import { useLocalState } from '../util/UseLocalStorage';

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [jwt, setJwt] = useLocalState("", "jwt");

    function sendRegisterRequest() {
        const reqBody = {
            username: username,
            password: password
        };
        
      fetch('http://localhost:8071/api/auth/register',{
      headers: {
        "Content-Type": "application/json"
      },
      method: "post",
      body: JSON.stringify(reqBody)
      })
        .then((response) => {
            if (response.status === 200) return response.json();
            else return Promise.reject("Ten login jest już zajęty");
        })
        .then(response => {
            setJwt(response.answer);
            window.location.href= "dashboard";
        })
        .catch((message) => {
            alert(message);
        });
    }
    return (
        <>
            <h1 style={{ margin: "1em" }}>Rejestracja</h1>
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
            <div style={{ margin: "1em" }}>
                <label htmlFor="password">Powtórz hasło</label><br/>
                <input type="haslo" id="password"value={password}
                onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div style={{ margin: "1em" }}><button id="submit" type="button"size="lg" onClick={() => sendRegisterRequest()}>Zarejestruj konto</button></div>
        </>
    );
}

export default Register;