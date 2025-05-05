
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    theme: localStorage.getItem("commuraX-theme") || "coffee"
}

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme: (state, action) => {
            localStorage.setItem("commuraX-theme", action.payload);
            state.theme = action.payload;
        }
    },
})

export const { setTheme } = themeSlice.actions
export default themeSlice.reducer

