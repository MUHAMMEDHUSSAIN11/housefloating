import axios from "axios";

interface LoginProps {
    email :string;
    password:string;
}

const Login = async ({
    email,
    password,
}: LoginProps) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/Auth/login`, {
            email,
            password,
        });
        
        if (response.status >= 200 && response.status < 300) {
            return response
        }
        
        return null;
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
};

export default Login;