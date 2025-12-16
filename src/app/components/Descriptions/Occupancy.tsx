'use client';

import { UserPlus, Users } from 'lucide-react';
import React from 'react';

interface OccupancyProps {
    Count: number,
    limit: number,
    title: string,
    category: string,
    adultAddonPrice: number,
    childAddonPrice: number,
}

const Occupancy: React.FC<OccupancyProps> = (props) => {
    return (
        <div className='mb-3'>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Normal Guest Count */}
                <div className="p-6 rounded-2xl shadow-lg border border-gray-200">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium mb-1">Current Guests</p>
                            <p className="text-4xl font-bold">{props.Count}</p>
                            <p className="text-xs mt-1">Standard occupancy</p>
                        </div>
                        <div className="bg-blue-200 p-3 rounded-xl">
                            <Users className="w-6 h-6 text-blue-700" />
                        </div>
                    </div>
                </div>

                {/* Maximum Guest Count */}
                <div className="p-6 rounded-2xl shadow-lg border border-gray-200">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium mb-1">Maximum Capacity</p>
                            <p className="text-4xl font-bold">{props.limit}</p>
                            <p className="text-xs mt-1">Total available space</p>
                        </div>
                        <div className="bg-blue-200 p-3 rounded-xl">
                            <UserPlus className="w-6 h-6 text-blue-700" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Occupancy;

