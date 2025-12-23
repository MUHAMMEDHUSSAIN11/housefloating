import axios from "axios";

interface SignUpProps {
    email :string;
    password:string;
    userName:string;
    mobileNumber:string|null;
}

const SignUp = async ({
    email,
    password,
    userName,
    mobileNumber,
}: SignUpProps) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/Auth/guestSignUp`, {
            email,
            password,
            userName,
            mobileNumber
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

export default SignUp;