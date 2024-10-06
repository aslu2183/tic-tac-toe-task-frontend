import { createSlice } from '@reduxjs/toolkit'

const initial_state = {
    isAuthenticated: false,
    token: '',
}

const authSlice = createSlice({
    name: "authenticate",
    initialState: initial_state,
    reducers: {
        login: (state, action) => {
            const payload = action.payload
            return {
                ...state,
                isAuthenticated: true,
                token: payload.token,
                ...payload,
            }
        },
        logout: (state) => {
            return {
                isAuthenticated: false,
                token: '',
            }
        },
        updateProfile: (state, action) => {
            const payload = action.payload
            return {
                ...state,
                ...payload
            };
        },
    }
})

export const { login, logout, updateProfile } = authSlice.actions
export default authSlice.reducer
