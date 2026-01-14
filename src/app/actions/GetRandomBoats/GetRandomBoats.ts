import axios from "axios";

const GetRandomBoats = async () => {
    try {
        console.log('public api',process.env.NEXT_PUBLIC_API)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/getRandomBoats`);
        
        if (response.status >= 200 && response.status < 300) {
            return response.data.data
        }
        
        return null;
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
};

export default GetRandomBoats;