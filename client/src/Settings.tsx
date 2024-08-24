import * as React from 'react';
import './css/Profile.css';
import { Link } from 'react-router-dom';
import axios from 'axios';



function Settings() {

    const [user, setUser] = React.useState<{ id: number, username: string, name: string, image_path: string | null | undefined }>();
    const [username, setUsername] = React.useState<string>();
    const [name, setName] = React.useState<string>();
    const [email, setEmail] = React.useState<string>();
    const [file, setFile] = React.useState<File | null>(null);
    const [errorMessage, setErrorMessage] = React.useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    function saveChanges() {
        axios.put(`api/users/update-profile-info`, {username, name, email}, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then(response => {
            console.log(response.data);
            localStorage.setItem('token', `Bearer ${response.data.token}`);
        }).catch(error => {
            setErrorMessage(error.response.data.message);
            console.log(error.response.data.message);
        })
    }

    function changePassword() {
        axios.get("/api/users/send-reset-password", {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then(response => {
            console.log(response.data);
        })
    }

    function sendPhoto() {
        console.log(file);

        if (file) {
            console.log("Uploading file...");

            const formData = new FormData();
            formData.append("image", file);

            try {
                // You can write the URL of your server or any other endpoint used for file upload
                const result = axios.post("/api/users/upload-profile-image", formData, {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }).then(response => {
                    if (user) {
                        let temp: string[] = response.data.imagePath.split('/');
                        temp.splice(temp.indexOf('upload') + 1, 0, 'c_fill,h_60,w_60');
                        response.data.imagePath = temp.join('/');
                        setUser({ ...user, image_path: response.data.imagePath });
                    }
                    console.log(response.data);
                })
            } catch (error) {
                console.error(error);
            }
        }
    }


    React.useEffect(() => {
        axios.get("/api/users/profile", {
            headers: { "Authorization": localStorage.getItem("token") }
        }).then(async response => {
            console.log(response.data.user);

            let temp: string[] = response.data.user.image_path.split('/');
            temp.splice(temp.indexOf('upload') + 1, 0, 'c_fill,h_60,w_60');
            response.data.user.image_path = temp.join('/');

            setUser(response.data.user);
            setUsername(response.data.user.username);
            setName(response.data.user.name);
            setEmail(response.data.user.email);
        });
    }, []);

    return (
        <>
        {errorMessage ?
        <>{errorMessage}</> :
        <></>}
            <div className='info-settings'>
                <div className='posUser'><h3>Username: </h3> <input type="text" onChange={event => setUsername(event.target.value)} value={username} /></div> <br />
                <div className='posUser'><h3>Name: </h3> <input type="text" onChange={event => setName(event.target.value)} value={name} /> </div> <br />
                <div className='posUser'><h3>Email: </h3> <input type="text" onChange={event => setEmail(event.target.value)} value={email} /> </div> <br />
                <button style={{ width: 'auto' }} onClick={saveChanges}>Save changes</button>
                <button style={{ width: 'auto' }} onClick={changePassword}>Change password</button>

            </div>

            <div className='info-settings'>
                <div className='info-img'>
                    {user?.image_path ?
                        <>
                            <img src={user?.image_path} alt={user.name} /><br />
                        </>
                        :
                        <></>
                    }
                    <input type="file" onChange={handleFileChange} /><br />
                    <button style={{ width: 'auto' }} onClick={sendPhoto}>Change photo</button>
                </div>
            </div>
        </>
    );
}

export default Settings;