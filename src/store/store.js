import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import snackbar from './snackbarSlice';

const store = configureStore({
    reducer: {
        user: userSlice,
        tostar: snackbar
    }
});

export default store;
