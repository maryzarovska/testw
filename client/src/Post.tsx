import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Post() {
    const params = useParams();
    useEffect(() => {
        console.log(params);
    }, [params]);
    return (<>

    </>);
}

export default Post;