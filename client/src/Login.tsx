import * as React from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

function Login() {

    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const topage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        dispatch();
        navigate("/profile")
    }

    function login(event:React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        axios.post("/api/users/signin", {
            username, password
        }).then(response => 
            {
                console.log(response.data);
                if (response.data.token) {
                   localStorage.setItem("token", `Bearer ${response.data.token}`) 
                }
                
            })
    }

    return ( 
        <>
        <h1>Log In</h1>

        <form onSubmit={login}>
                <input type="text" value={username} onChange={event => setUsername(event.target.value)} /> <br />
                <input type="password" value={password} onChange={event => setPassword(event.target.value)} /> <br /><br />
                <button type="submit">Log in</button>
            </form>
        </>
     );
}

export default Login;