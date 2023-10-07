import * as React from 'react';
import axios from 'axios';
import {HashLoader} from 'react-spinners';
import './css/Profile.css';

function Profile() {

    const [user, setUser] = React.useState<{id: number, username: string}>()
    const [loading, setLoading] = React.useState<boolean>(false)
    const [post, setPosts] = React.useState<{id: number, title: string, text: string, userId: number}[]>()

    React.useEffect(() => {
        axios.get("/api/users/profile", {
            headers: { "Authorization": localStorage.getItem("token") }
        }).then(async response => {
            setUser(response.data.user);

            let responsePosts = await axios. get<{id: number, title: string, text: string, userId: number}[]>(`/api/get-posts-by-username/${response.data.user.username}`)
            console.log(responsePosts.data);
        });
    }, []);

    return (
        <>
            <h1>Profile</h1>
            <h3>Username: </h3> {user?.username}
            <h3>Published works:</h3>
            <div className='spinnerWrap'>
                <HashLoader color="#6495ed" className='spinner'/>
            </div>
            
        </>
    );
}

export default Profile;