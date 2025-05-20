

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    voiceModal: false,
    recording: "",
    photoUrl: "",
    onlineUsers: []
}

const themeSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setVoiceModal: (state, action) => {
            state.voiceModal = action.payload;
        },
        setRecording: (state, action) => {
            state.recording = action.payload;
        },
        setPhotoUrl: (state, action) => {
            state.photoUrl = action.payload;
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        addOnlineUser: (state, action) => {
            state.onlineUsers = [...new Set([...state.onlineUsers, action.payload])];
        },
        removeOnlineUser: (state, action) => {
            state.onlineUsers = state.onlineUsers.filter(id => id !== action.payload);
        }
    }
})

export const { setVoiceModal, setRecording, setPhotoUrl, setOnlineUsers, addOnlineUser, removeOnlineUser } = themeSlice.actions
export default themeSlice.reducer

