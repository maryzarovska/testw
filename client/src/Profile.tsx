import * as React from 'react';
import axios from 'axios';

function Profile() {

    const [user, setUser] = React.useState<{id: number, username: string}>()

    React.useEffect(() => {
        axios.get("/api/users/profile", {
            headers: { "Authorization": localStorage.getItem("token") }
        }).then(response => setUser(response.data.user));
    }, []);

    return (
        <>
            <h1>Profile</h1>
            <h3>Username: </h3> {user?.username}
        </>
    );
}

export default Profile;