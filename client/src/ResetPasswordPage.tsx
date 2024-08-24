import axios from 'axios';
import * as React from 'react';
import { useNavigate, useNavigation, useParams } from 'react-router-dom';

function ResetPasswordPage() {

    const params = useParams();
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [isCodeValid, setIsCodeValid] = React.useState(false);
    const [user, setUser] = React.useState<any>(null);
    const navigate = useNavigate();

    React.useEffect(() => {
        axios.get(`/api/users/reset-code-check/${params.resetCode}`, {
            headers: { "Authorization": localStorage.getItem("token") }
        }).then(response => {
            console.log(response.data);
            setIsCodeValid(response.data.valid);
            if (response.data.valid) {
                setUser(response.data.user);
            }
        });
    }, []);

    function resetPassword() {
        axios.post(`/api/users/set-new-password`, {
            userId: user.id, password
        }, {
            headers: { "Authorization": localStorage.getItem("token") }
        }).then(response => {
            navigate("/profile");
        })
    }

    return (
        <>

            {isCodeValid ?
                <>
                    <input type="password" value={password} placeholder='Create new passoword' onChange={event => setPassword(event.target.value)} /> <br />
                    <input type="password" value={confirmPassword} placeholder='Repeat password' onChange={event => setConfirmPassword(event.target.value)} style={{ backgroundColor: (password == confirmPassword) ? "white" : "red" }} /> <br />
                    <button style={{width: 'auto'}} onClick={resetPassword} disabled={password!==confirmPassword || !password}>Reset password</button>
                </>
                :
                <><h1>Duration time for the code had passed.</h1></>
            }
            
        </>
    );
}

export default ResetPasswordPage;