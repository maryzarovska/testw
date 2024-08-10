import axios from 'axios';
import * as React from 'react';
import { useParams } from 'react-router-dom';

function ResetPasswordPage() {

    const params = useParams();
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    React.useEffect(() => {
        axios.get(`/api/users/reset-code-check/${params.resetCode}`, {
            headers: { "Authorization": localStorage.getItem("token") }
        }).then(response => {
            
        });
    }, []);

    return (
        <>
            <input type="password" value={password} placeholder='Create new passoword' onChange={event => setPassword(event.target.value)}/>
            <input type="password" value={confirmPassword} placeholder='Repeat password' onChange={event => setConfirmPassword(event.target.value)} style={{backgroundColor: (password==confirmPassword) ? "white" : "red"}}/>
        </>
    );
}

export default ResetPasswordPage;