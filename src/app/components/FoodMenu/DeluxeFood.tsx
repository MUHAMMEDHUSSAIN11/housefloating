'use client';
import { BoatCruisesId } from '@/app/enums/enums';
import React, { useState } from 'react';
import DayCruiseFood from './DeluxFoodMenu/DayCruiseFood';
import NightStayFood from './DeluxFoodMenu/NightStayFood';
import DayNightFood from './DeluxFoodMenu/DayNightFood';

export interface FoodProps {
    bookingType: number;
}

const DeluxeFood: React.FC<FoodProps> = ({ bookingType }) => {
    const [isVeg, setIsVeg] = useState(true);

    const handleVegClick = () => {
        setIsVeg(true);
    };
    const handleNonVegClick = () => {
        setIsVeg(false);
    };

    return (
        <div className="p-4 font-sans bg-white w-full">
            <div className="flex">
                <button className={`px-4 py-2 ${isVeg ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'} rounded-l-lg`} onClick={handleVegClick}>
                    Veg
                </button>
                <button className={`px-4 py-2 ${!isVeg ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'} rounded-r-lg`} onClick={handleNonVegClick}>
                    Non-Veg
                </button>
            </div>
            <div className="text-left list-inline mt-4">
                <div className="flex">
                    {bookingType === BoatCruisesId.dayCruise ? (
                        <DayCruiseFood isVeg={isVeg} />
                    ):
                    bookingType === BoatCruisesId.nightStay ?
                    (
                        <NightStayFood isVeg={isVeg} />
                    ):
                    (
                        <DayNightFood isVeg={isVeg} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeluxeFood;
