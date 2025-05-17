

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    voiceModal: false,
    recording: "",
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
    },
})

export const { setVoiceModal, setRecording } = themeSlice.actions
export default themeSlice.reducer

