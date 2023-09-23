import * as React from 'react';
import axios from 'axios';
import { BeatLoader } from 'react-spinners';

function Profile() {

    const [user, setUser] = React.useState<{ id: number, username: string }>()
    const [loading, setLoading] = React.useState<boolean>(false)
    const [posts, setPosts] = React.useState<{ id: number, title: string, text: string, userId: number }[]>()

    React.useEffect(() => {
        axios.get("/api/users/profile", {
            headers: { "Authorization": localStorage.getItem("token") }
        }).then(async response => {
            setUser(response.data.user);
            setLoading(true);
            let responsePosts = await axios.get<{ id: number, title: string, text: string, userId: number }[]>(`/api/get-posts-by-username/${response.data.user.username}`);
            setLoading(false);
            setPosts(responsePosts.data);
        });
    }, []);

    return (
        <>
            <h1>Profile</h1>
            <h3>Username: {user?.username}</h3>
            {loading ?
                <BeatLoader />
                :
                <></>
            }
        </>
    );
}

export default Profile;