import axios from "axios";

interface GetAvailableHouseBoatsProps {
    TripModeId: number;
    CruiseTypeId: number;
    BoatCategoryId: number;
    RoomCount: number;
    CheckInDate?: Date | null;
    CheckOutDate?: Date | null;
    Skip: number;
    Take: number;
    OrderBy?: string;
}

const GetAvailableHouseBoats = async ({
    TripModeId,
    CruiseTypeId,
    BoatCategoryId,
    RoomCount,
    CheckInDate,
    CheckOutDate,
    Skip,
    Take,
    OrderBy
}: GetAvailableHouseBoatsProps) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/getAvailableBoats`, {
            params: { 
                TripModeId, 
                CruiseTypeId, 
                BoatCategoryId, 
                RoomCount, 
                CheckInDate, 
                CheckOutDate, 
                Skip, 
                Take, 
                OrderBy 
            },
        });
        
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        
        return null;
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
};

export default GetAvailableHouseBoats;