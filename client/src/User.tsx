import axios from 'axios';
import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Post } from './PostType';
import { HashLoader } from 'react-spinners';

function User() {

    const params = useParams();
    const [userData, setUserData] = React.useState<{ username: string, id: number }>();
    const [posts, setPosts] = React.useState<Post[]>([]);
    const [tableName, setTableName] = React.useState<"published works">("published works");
    const [loading, setLoading] = React.useState<boolean>(true)
    const [isSubscribed, setIsSubscribed] = React.useState<boolean>(true);

    function subscribe() {

    }

    React.useEffect(() => {
        axios.get(`/api/users/profile/${params.username}`).then(response => {
            setUserData(response.data)
            axios.get(``)
        })

        axios.get<{ data: Post[], meta: any }>(`/api/get-posts-by-username-foreign-user/${params.username}`).then(response => {
            setPosts(response.data.data)
            setLoading(false)
        })
    }, [])

    return (
        <>
            <h1>Profile</h1>
            <div className='info'>
                <div className='posUser'>
                    <h3>Username: </h3>
                    {userData?.username} <br /><br />
                    <button onClick={subscribe}>{isSubscribed?"Unsubscribe":"Subscribe"}</button>
                </div>
            </div>
            <div id='navP'>
                <span className={tableName === "published works" ? 'navItP activated' : 'navItP'} onClick={() => setTableName("published works")}>Published Works</span>
            </div>

            {tableName === "published works" ? <>
                {loading ?
                    <div className='spinnerWrap'>
                        <HashLoader color="#6495ed" className='spinner' />
                    </div> :
                    <div className='postsWrap'>
                        {posts?.map(post => <div className='postItem' key={post.id}>
                            <h4><Link to={`/posts/${post.id}`}>{post.title}</Link></h4>
                            <p>Author: <Link to={`/user/${userData?.username}`}>{userData?.username}</Link></p>
                            <p>Rating: {post.rating}</p>
                            <p>Relationship: {post.relationship}</p>
                            <p>Categories: {post.categories_list ? post.categories_list.split(',').join(', ') : ''}</p>
                            <p>Summary: {post.summary}</p>
                        </div>)}
                    </div>
                }
            </> : <>Error</>
            }
        </>
    );
}

export default User;