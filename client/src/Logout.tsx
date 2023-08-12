import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch()
        navigate("/")
    })
    return ( <>
    
    </> );
}

export default Logout;