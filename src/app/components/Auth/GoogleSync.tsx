'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import useAuth from "@/app/hooks/useAuth";
import SignUp from "@/app/actions/SignUp/SignUp";
import Login from "@/app/actions/Login/Login";
import toast from "react-hot-toast";

const GoogleSync = () => {
    const { data: session, status } = useSession();
    const { isAuthenticated, login } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [hasAttemptedSync, setHasAttemptedSync] = useState(false);

    useEffect(() => {
        // Reset attempt flag if user logs out of Google
        if (status !== "authenticated") {
            setHasAttemptedSync(false);
        }
    }, [status]);

    useEffect(() => {
        // Only run if authenticated with Google but NOT in Redux, and not currently processing or already tried
        if (status === "authenticated" && session?.user && !isAuthenticated && !isProcessing && !hasAttemptedSync) {

            const handleSync = async () => {
                if (!session?.user) return;

                setIsProcessing(true);
                setHasAttemptedSync(true); // Ensure we only try once per session

                const email = session.user.email!;
                const userName = session.user.name || email.split('@')[0];
                const googleId = (session.user as any).id || email;
                const password = `Google_${googleId}`;

                try {
                    // 1. Try to Login
                    const loginResp = await Login({ email, password });

                    if (loginResp && loginResp.status === 200 && loginResp.data?.data) {
                        const { user, accessToken } = loginResp.data.data;
                        login(user, accessToken);
                        toast.success(`Welcome back, ${userName}!`);
                        return;
                    }

                    // 2. If Login fails (400 or other), try to SignUp
                    const signUpResp = await SignUp({
                        email,
                        password,
                        userName,
                        mobileNumber: ''
                    });

                    if (signUpResp && signUpResp.status === 200 && signUpResp.data?.data) {
                        const { user, accessToken } = signUpResp.data.data;
                        login(user, accessToken);
                        toast.success(`Account created successfully! Welcome, ${userName}`);
                    } else {
                        toast.error("Failed to sync Google account with our system.");
                    }
                } catch (error) {
                    console.error("Google sync error:", error);
                    toast.error("An error occurred while syncing your Google account.");
                } finally {
                    setIsProcessing(false);
                }
            };

            handleSync();
        }
    }, [status, session, isAuthenticated, isProcessing, hasAttemptedSync, login]);

    return null;
};

export default GoogleSync;
