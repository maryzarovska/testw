import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HashLoader } from 'react-spinners';

function Post() {
    const params = useParams();
    const [post, setPost] = useState<any | null>()
    const [loading, setLoading] = React.useState<boolean>(true)
    useEffect(() => {
        axios.get(`/api/posts/${params.id}`).then(response => {
            setPost(response.data);
            setLoading(false);
        })
    }, []);
    return (<>
        {loading ?
                <div className='spinnerWrap'>
                    <HashLoader color="#6495ed" className='spinner' />
                </div> :
        <>{post ? 
        <>{post.title} <br /><br />{post.text}</> : <>404 Not Found</>}</>}
    </>);
}

export default Post;