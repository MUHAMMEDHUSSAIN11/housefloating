'use client';

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import useAuth from "@/app/hooks/useAuth";
import GoogleAuth from "@/app/actions/GoogleAuth/GoogleAuth";
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
                const idToken = (session as any).user?.idToken;

                if (!idToken) {
                    console.error("No idToken found in session");
                    return;
                }

                setIsProcessing(true);
                setHasAttemptedSync(true); // Ensure we only try once per session

                try {
                    const response = await GoogleAuth({
                        idToken,
                        provider: "google"
                    });

                    if (response && response.status === 200 && response.data?.data) {
                        const { user, accessToken } = response.data.data;
                        login(user, accessToken);
                        toast.success(`Welcome, ${user.name || 'User'}!`);
                    } else {
                        toast.error("Failed to sync Google account.");
                        // If sync fails, finish the Google thing by signing out
                        await signOut({ redirect: false });
                    }
                } catch (error) {
                    console.error("Google sync error:", error);
                    toast.error("An error occurred while syncing your Google account.");
                    // If sync fails, finish the Google thing by signing out
                    await signOut({ redirect: false });
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
