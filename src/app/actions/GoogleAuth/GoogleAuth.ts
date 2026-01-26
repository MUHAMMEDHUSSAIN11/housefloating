import axios from "axios";

interface GoogleAuthProps {
    idToken: string | null;
    provider: string | null;
}

const GoogleAuth = async ({
    idToken,
    provider,
}: GoogleAuthProps) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/Auth/googleLogin`, {
            idToken,
            provider,
        });

        if (response.status >= 200 && response.status < 300) {
            return response;
        }

        return null;
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
};

export default GoogleAuth;
