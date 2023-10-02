'use client';

import React from 'react';

interface OccupancyProps {
    Count: number,
    limit: number,
    title: string,
    category: string,
}

const Occupancy: React.FC<OccupancyProps> = (props) => {
    return (
        <div>
            <h1 className="font-sans font-semibold text-2xl mb-5 p-2">{props.title}</h1>
            <div className="grid grid-cols-1/2 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 p-1">
                <div className="p-4 rounded-lg shadow-md bg-white w-full">
                    <div>
                        <h2 className="text-lg font-sans text-gray-900">Normal Guest Count</h2>
                        <p className="pl-4">{props.Count}</p>
                    </div>
                    <hr/>
                    <div>
                        <h2 className="text-lg font-sans text-gray-900 pt-4">Maximum Guest Count</h2>
                        <p className="pl-4">{props.limit}</p>
                    </div>
                </div>
                <div className="p-4 rounded-lg shadow-md bg-white w-full">
                    <div>
                        <h2 className="text-lg font-sans text-gray-900">Extra Adult Cost</h2>
                        
                        {props.category === "Deluxe Houseboats" ? (
                            <p className="pl-4">900</p>
                        ) : props.category === "Premium Houseboats" ? (
                            <p className=" pl-4">1200</p>
                        ) : props.category === "Luxury Houseboats" ? (
                            <p className=" pl-4">1500</p>
                        ) : (
                            <p className=" pl-4"></p>
                        )}
                    </div>
                    <hr/>
                    <div>
                        <h2 className="text-lg font-sans text-gray-900 pt-4">Extra Child Cost</h2>
                        {props.category === "Deluxe Houseboats" ? (
                            <p className=" pl-4">800</p>
                        ) : props.category === "Premium Houseboats" ? (
                            <p className=" pl-4">1000</p>
                        ) : props.category === "Luxury Houseboats" ? (
                            <p className=" pl-4">1200</p>
                        ) : (
                            <p className="text-gray-600 pl-4"></p>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Occupancy;

