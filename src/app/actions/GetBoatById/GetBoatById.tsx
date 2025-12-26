import axios from "axios";

interface GetBoatByIdProps {
    BoatId: number;
    Date: Date;
    CruiseTypeId: number;
}

const GetBoatById = async ({
    BoatId,
    Date,
    CruiseTypeId
}: GetBoatByIdProps) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/getBoatDetails`, {
            params: { 
                BoatId, 
                Date, 
                CruiseTypeId
            },
        });
        if (response.status >= 200 && response.status < 300) {
            return response.data.data
        }

        return null;
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
};

export default GetBoatById;