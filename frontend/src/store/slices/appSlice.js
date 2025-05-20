

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    voiceModal: false,
    recording: "",
    photoUrl: "",
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
    },
})

export const { setVoiceModal, setRecording, setPhotoUrl } = themeSlice.actions
export default themeSlice.reducer

