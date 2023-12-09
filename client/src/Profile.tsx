import * as React from 'react';
import axios from 'axios';
import { HashLoader } from 'react-spinners';
import './css/Profile.css';
import { Link } from 'react-router-dom';
import { response } from 'express';

function Profile() {

    const [user, setUser] = React.useState<{ id: number, username: string }>()
    const [loading, setLoading] = React.useState<boolean>(true)
    const [posts, setPosts] = React.useState<{ id: number, title: string, text: string, userId: number, rating: string, relationship: string }[]>()
    const modal = React.useRef<HTMLDivElement>(null)
    const [idToDelete, setIdToDelete] = React.useState<number | null>()

    React.useEffect(() => {
        axios.get("/api/users/profile", {
            headers: { "Authorization": localStorage.getItem("token") }
        }).then(async response => {
            setUser(response.data.user);

            let responsePosts = await axios.get<{ data: { id: number, title: string, text: string, userId: number, rating: string, relationship: string }[], meta: any }>(`/api/get-posts-by-username/${response.data.user.username}`)
            setLoading(false)
            setPosts(responsePosts.data.data);
        });
    }, []);

    function deleteClick(event: any) {
        if (modal.current) {
            modal.current.style.display = "block";
            document.body.style.overflow = "hidden";
            setIdToDelete(parseInt(event.target.getAttribute("data-id")))
        }
    }

    function deleteAccept() {
        axios.delete(`/api/posts/${idToDelete}`, { headers: { "Authorization": localStorage.getItem("token") } }).then(response => {
            if (response.status === 200) {
                setPosts(posts?.filter(post => {
                    console.log(post.id, idToDelete);
                    return post.id !== idToDelete
                }));
                if (modal.current) {
                    modal.current.style.display = "none";
                    document.body.style.overflow = "visible"
                    setIdToDelete(null)
                }
            }
        })
    }

    React.useEffect(() => { console.log(idToDelete) }, [idToDelete])

    function cancelClick() {
        if (modal.current) {
            modal.current.style.display = "none";
            document.body.style.overflow = "visible"
            setIdToDelete(null)
        }
    }

    return (
        <>
            <h1>Profile</h1>
            <div className='info'><div className='posUser'><h3>Username: </h3> {user?.username}</div> <br />
            <div className='create'><Link to="/create-work">&#128934; Create a new work</Link></div></div>
            <div id='navP'>
                <Link to={"/"} className='navItP' id='activated'>Published Works</Link>
                <Link to={"/"} className='navItP'>Drafts</Link>
                <Link to={"/"} className='navItP'>Comments</Link>
            </div>
            {loading ?
                <div className='spinnerWrap'>
                    <HashLoader color="#6495ed" className='spinner' />
                </div> :
                <div className='postsWrap'>
                    {posts?.map(post => <div className='postItem' key={post.id}>
                        <h4>{post.title}</h4>
                        <p>Rating: {post.rating}</p>
                        <p>Relationship: {post.relationship}</p>
                        <p>{post.text}</p>
                        <button onClick={deleteClick} id='deleteBtn' data-id={post.id}>Delete post</button>
                    </div>)}
                </div>
            }

            <div className='modal' ref={modal} onClick={cancelClick}>
                <div className='modalData' onClick={event => event.stopPropagation()}>
                    <h2>Delete post</h2>
                    <p>Are you sure you want to delete this post?</p>
                    <p>You won't be able to restore it.</p>
                    <button className='button2' id='correct' onClick={deleteAccept}>Yes</button>
                    <button className='button2' id='cancel' onClick={cancelClick}>Cancel</button>
                </div>
            </div>

        </>
    );
}

export default Profile;