import { createSlice } from "@reduxjs/toolkit";

const getUserFromLocalStorage = () => {
    const userString = localStorage.getItem('user');
    if (userString) {
        return JSON.parse(userString);
    } else {
        return null;
    }
}

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        value: getUserFromLocalStorage()
    },
    reducers: {
        login: (state, action) => {
            state.value = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        }, 
        logout: (state) => {
            state.value = null;
            localStorage.removeItem('user');
        }
    }
})

export const {login, logout} = userSlice.actions;
export default userSlice.reducer;