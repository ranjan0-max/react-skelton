import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: null, // Initially, no user is logged in
        isLoggedIn: false
    },
    reducers: {
        login: (state, action) => {
            state.userInfo = action.payload; // Set user info from payload
            state.isLoggedIn = true; // Set logged in state to true
        },
        logout: (state) => {
            state.userInfo = null; // Clear user info
            state.isLoggedIn = false; // Set logged in state to false
        },
        updateUser: (state, action) => {
            state.userInfo = { ...state.userInfo, ...action.payload }; // Update user info
        }
    }
});

// Export actions
export const { login, logout, updateUser } = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
