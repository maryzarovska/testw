import * as React from 'react';
import axios from 'axios';

function Register() {

    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");

    function register(event:React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        axios.post("/api/users/signup", {
            username, password
        }).then(response => console.log(response.data))
    }

    return (
        <>
            <h1>Registration</h1>

            <form onSubmit={register}>
                <input type="text" value={username} onChange={event => setUsername(event.target.value)} /> <br />
                <input type="password" value={password} onChange={event => setPassword(event.target.value)} /> <br /><br />
                <button type="submit">Register</button>
            </form>
        </>
    );
}

export default Register;