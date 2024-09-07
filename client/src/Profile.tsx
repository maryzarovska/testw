import * as React from 'react';
import axios from 'axios';
import { HashLoader } from 'react-spinners';
import './css/Profile.css';
import { Link } from 'react-router-dom';
import { response } from 'express';
import { Post } from './PostType';

type Subscription = {
    id: number;
    username: string;
    name: string | null | undefined;
    image_path: string | null | undefined;
}

function Profile() {

    const [user, setUser] = React.useState<{ id: number, username: string, name: string, image_path: string | null | undefined }>()
    const [loading, setLoading] = React.useState<boolean>(true)
    const [posts, setPosts] = React.useState<Post[]>()
    const modal = React.useRef<HTMLDivElement>(null)
    const [idToDelete, setIdToDelete] = React.useState<number | null>()
    const [tableName, setTableName] = React.useState<"published works" | "drafts" | "subscriptions">("published works");
    const [file, setFile] = React.useState<File | null>(null);
    const [subscriptions, setSubscriptions] = React.useState<Subscription[]>([])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    React.useEffect(() => {
        axios.get("/api/users/profile", {
            headers: { "Authorization": localStorage.getItem("token") }
        }).then(async response => {
            console.log(response.data.user);

            let temp: string[] = response.data.user.image_path.split('/');
            temp.splice(temp.indexOf('upload') + 1, 0, 'c_fill,h_60,w_60');
            response.data.user.image_path = temp.join('/');

            setUser(response.data.user);

            let responsePosts = await axios.get<{ data: Post[], meta: any }>(`/api/get-posts-by-username/${response.data.user.username}`)
            setLoading(false)
            setPosts(responsePosts.data.data);

            let responseSubscriptions = await axios.get<Subscription[]>(`/api/users/get-subscriptions/${response.data.user.id}`, {
                headers: { "Authorization": localStorage.getItem("token") }
            })
            setSubscriptions(responseSubscriptions.data);
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

    return (
        <>
            <h1>Profile</h1>
            <div className='info-img'>
                {user?.image_path ?
                    <>
                        <img src={user?.image_path} alt={user.name} /><br />
                    </>
                    :
                    <></>
                }
            </div>
            <div className='info'>
                <div className='posUser'><h3>Username: </h3> {user?.username}</div> <br />
                <div className='posUser'><h3>Name: </h3> {user?.name}</div> <br />
                <div className='create'><Link to="/create-work">&#128934; Create a new work</Link></div>
                <div className='create'><Link to="/settings">Edit Profile</Link></div>

            </div>



            <div id='navP'>
                <span className={tableName === "published works" ? 'navItP activated' : 'navItP'} onClick={() => setTableName("published works")}>Published Works</span>
                <span className={tableName === "drafts" ? 'navItP activated' : 'navItP'} onClick={() => setTableName("drafts")}>Drafts</span>
                <span className={tableName === "subscriptions" ? 'navItP activated' : 'navItP'} onClick={() => setTableName("subscriptions")}>Subscriptions</span>
            </div>

            {tableName === "published works" ? <>
                {loading ?
                    <div className='spinnerWrap'>
                        <HashLoader color="#6495ed" className='spinner' />
                    </div> :
                    <div className='postsWrap'>
                        {posts?.filter(post => !post.is_draft).map(post => <div className='postItem' key={post.id}>
                            <h4><Link to={`/posts/${post.id}`}>{post.title}</Link></h4>
                            <p>Author: <Link to={`/user/${user?.username}`}>{user?.username}</Link></p>
                            <p>Rating: {post.rating}</p>
                            <p>Relationship: {post.relationship}</p>
                            <p>Categories: {post.categories_list ? post.categories_list.split(',').join(', ') : ''}</p>
                            <p>Summary: {post.summary}</p>
                            <button onClick={deleteClick} id='deleteBtn' data-id={post.id}>Delete post</button>
                            <Link to={`/edit/${post.id}`} className='navIt'>Edit</Link>
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
                </div> </> :

                tableName === "drafts" ?
                    <>
                        <div className='postsWrap'>
                            {posts?.filter(post => post.is_draft).map(post => <div className='postItem' key={post.id}>
                                <h4><Link to={`/posts/${post.id}`}>{post.title}</Link></h4>
                                <p>Author: <Link to={`/user/${user?.username}`}>{user?.username}</Link></p>
                                <p>Rating: {post.rating}</p>
                                <p>Relationship: {post.relationship}</p>
                                <p>Categories: {post.categories_list ? post.categories_list.split(',').join(', ') : ''}</p>
                                <p>Summary: {post.summary}</p>
                                <button onClick={deleteClick} id='deleteBtn' data-id={post.id}>Delete post</button>
                            </div>)}
                        </div>
                    </> :

                    tableName === "subscriptions" ?
                        <>
                            <div className='postwrap'>
                                {subscriptions.map(subscription => <div className='postItem' key={subscription.id}>
                                    <h4><Link to={`/user/${subscription.username}`}>{subscription.username}</Link></h4>
                                </div>)}
                            </div>
                        </> : <>Error</>
            }

        </>
    );
}

export default Profile;