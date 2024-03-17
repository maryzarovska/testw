import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { HashLoader } from 'react-spinners';

function Post() {
    const params = useParams();
    const [post, setPost] = useState<any | null>()
    const [loading, setLoading] = React.useState<boolean>(true)
    const [comment, setComment] = useState<any[]>([]);
    const [text, setText] = useState<string>("");
    const user = useSelector((state: any) => state.user.value);

    useEffect(() => {
        axios.get(`/api/posts/${params.id}`).then(response => {
            setPost(response.data);
            setLoading(false);
            axios.get(`/api/comments/${params.id}`).then(response => {
                setComment(response.data.data);
            })
        })
    }, []);

    function publish() {
        axios.post("/api/create-comment", { user_id: user.id, post_id: post.id, text }, { headers: { "Authorization": localStorage.getItem("token") } }).then(response=>{
            console.log(response.data.insertId);
            setComment([...comment, {id: response.data.insertId, text, username: user.username}])
            setText("");
        })
    }

    return (<>
        {loading ?
            <div className='spinnerWrap'>
                <HashLoader color="#6495ed" className='spinner' />
            </div> :
            <>{post ?
                <>{post.title} <br /><br />{post.text}

                    <div style={{ width: "60%", padding: "20px", marginRight: "20%", marginLeft: "20%" }}>
                        <div>
                            <textarea name="" id="" cols={100} rows={10} value={text} onChange={event => setText(event.target.value)}></textarea>
                        </div>
                        <button type="submit" onClick={publish}>Send</button>
                    </div>

                    {
                        comment.map(comment =>
                            <div key={comment.id}>
                                <h3>{comment.username}</h3>
                                <p>{comment.text}</p>
                            </div>

                        )
                    }



                </> : <>404 Not Found</>}</>}
    </>);
}

export default Post;