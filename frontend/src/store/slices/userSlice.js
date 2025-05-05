import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    fullName: '',
    email: '',
    bio: '',
    profilePic: '',
    nativeLanguage: '',
    learningLanguage: '',
    location: '',
    isOnboarded: false,
    friends: [],
    userId: '',
    userAccessToken: '',
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        
    },
})

export const { } = userSlice.actions
export default userSlice.reducer

