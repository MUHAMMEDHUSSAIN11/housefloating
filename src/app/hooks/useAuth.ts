'use client';

import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setCredentials, logout as logoutAction } from '@/lib/features/authSlice';
import { signOut } from 'next-auth/react';

interface User {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    whatsAppNumber: string | null;
    profilePictureUrl: string | null;
}

const useAuth = () => {
    const dispatch = useAppDispatch();
    const { user, isLoading, isAuthenticated } = useAppSelector((state) => state.auth);
    const router = useRouter();

    const login = (userData: User, accessToken: string) => {
        dispatch(setCredentials({ user: userData, accessToken, refreshToken: '' }));
    };

    const logout = async () => {
        dispatch(logoutAction());
        // Specifically sign out from next-auth to prevent GoogleSync from re-logging in
        await signOut({ redirect: false });
        router.push('/');
        router.refresh();
    };

    return {
        user,
        isLoading,
        isAuthenticated,
        login,
        logout
    };
};

export default useAuth;
