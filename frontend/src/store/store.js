
import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './slices/themeSlice';
import userReducer from './slices/userSlice';
import appReducer from './slices/appSlice';

const store = configureStore({
    reducer: {
        theme: themeReducer,
        user: userReducer,
        app: appReducer,
    },
})


export default store;