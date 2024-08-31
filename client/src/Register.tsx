import * as React from 'react';
import axios from 'axios';

function Register() {

    const [email, setEmail] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");

    function register(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        axios.post("/api/users/signup", {
            email, username, password
        }).then(response => {
            console.log(response.data);
            if(!response.data.success) {
                setErrorMessage(response.data.message);
            }
        })
    }

    return (
        <>
            <h1>Registration</h1>

            <form onSubmit={register}>
                <input type="text" value={email} placeholder='Email' onChange={event => setEmail(event.target.value)} /> <br />
                <input type="text" value={username} placeholder='Username' onChange={event => setUsername(event.target.value)} /> <br />
                <input type="password" value={password} placeholder='Password' onChange={event => setPassword(event.target.value)} /> <br /><br />
                {errorMessage?
                <p>{errorMessage}</p>:
                <></>}
                <button type="submit">Register</button>
            </form>
        </>
    );
}

export default Register;