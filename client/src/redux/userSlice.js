import { createSlice } from '@reduxjs/toolkit';

const initialState = { currentUser: null };
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
        },
        signOutSuccess: (state) => {
            state.currentUser = null;
        },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload;
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null;
        },
    }
})

export const { signInSuccess, signOutSuccess, updateUserSuccess, deleteUserSuccess } = userSlice.actions;
export default userSlice.reducer;