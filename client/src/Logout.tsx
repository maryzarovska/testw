import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from './application-store/userSlice';

function Logout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(logout());
        navigate("/");
    })
    return ( <>
    
    </> );
}

export default Logout;