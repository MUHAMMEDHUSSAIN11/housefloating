import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface User {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    whatsAppNumber: string | null;
    profilePictureUrl: string | null;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>
        ) => {
            const { user, accessToken, refreshToken } = action.payload;
            state.user = user;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.isAuthenticated = true;
            state.isLoading = false;

            Cookies.set('token', accessToken, { expires: 7 });
            Cookies.set('user', JSON.stringify(user), { expires: 7 });
        },
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.isLoading = false;

            Cookies.remove('token');
            Cookies.remove('user');
        },
        initializeAuth: (state) => {
            const token = Cookies.get('token');
            const userCookie = Cookies.get('user');

            if (token && userCookie) {
                try {
                    const user = JSON.parse(userCookie);
                    state.user = user;
                    state.accessToken = token;
                    state.isAuthenticated = true;
                } catch (error) {
                    console.error("Failed to parse user cookie", error);
                }
            }
            state.isLoading = false;
        }
    },
});

export const { setCredentials, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
