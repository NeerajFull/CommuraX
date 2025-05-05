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
        setUserDetails: (state, action) => {
            const { fullName, email, bio, profilePic, nativeLanguage, learningLanguage, location, _id } = action.payload
            state.fullName = fullName
            state.email = email
            state.bio = bio
            state.profilePic = profilePic
            state.nativeLanguage = nativeLanguage
            state.learningLanguage = learningLanguage
            state.location = location
            state.userId = _id
        },
        setUserAccessToken: (state, action) => {
            state.userAccessToken = action.payload
        },
    },
})

export const { setUserDetails, setUserAccessToken } = userSlice.actions
export default userSlice.reducer

