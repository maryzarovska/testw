import * as React from 'react';
import axios from 'axios';

function Profile() {

    React.useEffect(()=>{
        axios.get("/api/users/profile", {
            headers: {"Authorization": localStorage.getItem("token")}
        }).then(response => console.log(response))
    }, [])

    return ( 
        <>
        <h1>Profile</h1>
        <h3>Username: </h3>
        </>
     );
}

export default Profile;