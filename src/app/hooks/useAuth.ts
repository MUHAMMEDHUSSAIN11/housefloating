import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector, useAppStore } from '@/lib/hooks';
import { setCredentials, logout as logoutAction, initializeAuth } from '@/lib/features/authSlice';

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

    const logout = () => {
        dispatch(logoutAction());
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
