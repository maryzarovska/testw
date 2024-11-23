import * as React from 'react';
import axios from 'axios';
import { HashLoader } from 'react-spinners';
import './css/Profile.css';
import { Link } from 'react-router-dom';
import { response } from 'express';
import { Post } from './PostType';
import { useSearchParams } from "react-router-dom";

type Subscription = {
    id: number;
    username: string;
    name: string | null | undefined;
    image_path: string | null | undefined;
}

type ProfileTab = "published_works" | "drafts" | "subscriptions";

function Profile() {
    const [user, setUser] = React.useState<{ id: number, username: string, name: string, image_path: string | null | undefined }>()
    const [loading, setLoading] = React.useState<boolean>(true)
    const [posts, setPosts] = React.useState<Post[]>()
    const modal = React.useRef<HTMLDivElement>(null)
    const [idToDelete, setIdToDelete] = React.useState<number | null>()
    const [tableName, setTableName] = React.useState<ProfileTab>("published_works");
    const [file, setFile] = React.useState<File | null>(null);
    const [subscriptions, setSubscriptions] = React.useState<Subscription[]>([])
    let [searchParams, setSearchParams] = useSearchParams();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    React.useEffect(() => {
        let pageName: any = searchParams.get('p');
        if (pageName && ["published_works", "drafts", "subscriptions"].includes(pageName)) {
            setTableName(pageName);
        } else {
            setSearchParams(prevParams => {
                prevParams.set('p', 'published_works');
                return prevParams;
            })
        }
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
                <span
                    className={tableName === "published_works" ? 'navItP activated' : 'navItP'}
                    onClick={() => {
                        setTableName("published_works");
                        setSearchParams(
                            prevParams => {
                                prevParams.set('p', 'published_works');
                                return prevParams;
                            }
                        )
                        }}>Published Works</span>
                <span
                    className={tableName === "drafts" ? 'navItP activated' : 'navItP'}
                    onClick={() => {
                        setTableName("drafts");
                        setSearchParams(
                            prevParams => {
                                prevParams.set('p', 'drafts');
                                return prevParams;
                            }
                        )
                        }}>Drafts</span>
                <span
                    className={tableName === "subscriptions" ? 'navItP activated' : 'navItP'}
                    onClick={() => {
                        setTableName("subscriptions");
                        setSearchParams(
                            prevParams => {
                                prevParams.set('p', 'subscriptions');
                                return prevParams;
                            }
                        )
                        }}>Subscriptions</span>
            </div>

            {tableName === "published_works" ? <>
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
                                <Link to={`/edit/${post.id}`} className='navIt'>Edit</Link>
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