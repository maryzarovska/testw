import * as React from 'react';
import { Link } from 'react-router-dom';
import './css/NavPannel.css';
import { useSelector } from 'react-redux';


function NavPannel() {
    const user = useSelector((state: any) => state.user);
    return (<>
        <div id='nav'>
            <Link to={"/"} className='navIt'>Home</Link>
            <Link to={"/fandoms"} className='navIt'>Fandoms</Link>
            <Link to={"/search"} className='navIt'>Search</Link>
            <Link to={"/about"} className='navIt'>About</Link>
            {user.value ?
                <>
                    <Link to='/profile' className='navIt'>Profile</Link><Link to='/logout' className='navIt'>Log Out</Link>
                </>
                : <>
                    <Link to='/registration' className='navIt'>Register</Link><Link to='/login' className='navIt'>Log In</Link>
                </>
            }
        </div>
    </>);
}

export default NavPannel;