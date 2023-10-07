import * as React from 'react';
import axios from 'axios';
import { HashLoader } from 'react-spinners';
import './css/Profile.css';

function Profile() {

    const [user, setUser] = React.useState<{ id: number, username: string }>()
    const [loading, setLoading] = React.useState<boolean>(true)
    const [posts, setPosts] = React.useState<{ id: number, title: string, text: string, userId: number }[]>()

    React.useEffect(() => {
        axios.get("/api/users/profile", {
            headers: { "Authorization": localStorage.getItem("token") }
        }).then(async response => {
            setUser(response.data.user);

            let responsePosts = await axios.get<{ data: { id: number, title: string, text: string, userId: number }[], meta: any }>(`/api/get-posts-by-username/${response.data.user.username}`)
            setLoading(false)
            setPosts(responsePosts.data.data);
        });
    }, []);

    return (
        <>
            <h1>Profile</h1>
            <h3>Username: </h3> {user?.username}
            <h3>Published works:</h3>
            {loading ?
                <div className='spinnerWrap'>
                    <HashLoader color="#6495ed" className='spinner' />
                </div> :
                <div className='postsWrap'>
                    {posts?.map(post => <div className='postItem' key={post.id}>
                        <h4>{post.title}</h4>
                        <p>{post.text}</p>
                    </div>)}
                </div>
            }


        </>
    );
}

export default Profile;