'use client';

import React, { useState } from 'react';
import AdditionalInfo from './AdditionalInfo';


const SharingNightStaySteps = () => {
    const [showMore, setShowMore] = useState(false);

    const toggleShowMore = () => {
        setShowMore(!showMore);
    };

    return (
        <div>
            <section className="sm:pl-3 p-2 body-font">
                <div className="container flex flex-wrap">
                    <div className="flex flex-wrap w-full">
                        <div className="md:pr-10 md:py-6">
                            <h1 className="font-sans font-semibold text-2xl text-gray-900 mb-5 ">Night Stay Schedule</h1>
                            <div className="flex relative pb-12">
                                <div className="h-full w-6 absolute inset-0 flex items-center justify-center">
                                    <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
                                </div>
                                <div className="shrink-0 w-6 h-6 rounded-full bg-blue-500 inline-flex items-center justify-center text-white relative">
                                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                                </div>
                                <div className="grow pl-4">
                                    <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">Check-In</h2>
                                    <p className="text-sm text-gray-900 mt-2">Time: 6:00 PM</p>
                                    <p className="leading-relaxed">
                                        Begin your houseboat journey with a warm welcome and introduction about the cruise and local geography.
                                    </p>
                                </div>
                            </div>
                            <div className="flex relative pb-12">
                                <div className="h-full w-6 absolute inset-0 flex items-center justify-center">
                                    <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
                                </div>
                                <div className="shrink-0 w-6 h-6 rounded-full bg-blue-500 inline-flex items-center justify-center text-white relative">
                                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                                </div>
                                <div className="grow pl-4">
                                    <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">Evening Tea</h2>
                                    <p className="text-sm text-gray-900 mt-2">Time: 05:30 PM</p>
                                    <p className="leading-relaxed">
                                        Enjoy evening snacks while continuing the cruise through beautiful rivers, canals, and village landscapes.
                                    </p>
                                </div>
                            </div>
                            {showMore && (
                                <>
                                    <div className="flex relative pb-12">
                                        <div className="h-full w-6 absolute inset-0 flex items-center justify-center">
                                            <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
                                        </div>
                                        <div className="shrink-0 w-6 h-6 rounded-full bg-blue-500 inline-flex items-center justify-center text-white relative">
                                            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                                        </div>
                                        <div className="grow pl-4">
                                            <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">Sunset</h2>
                                            <p className="leading-relaxed">
                                                Experience the breathtaking sunset over the tranquil backwaters while you relax on the houseboat.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex relative pb-12">
                                        <div className="h-full w-6 absolute inset-0 flex items-center justify-center">
                                            <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
                                        </div>
                                        <div className="shrink-0 w-6 h-6 rounded-full bg-blue-500 inline-flex items-center justify-center text-white relative">
                                            <div className="h-1 w-1 bg-blue-500 rounded-full"></div>
                                        </div>
                                        <div className="grow pl-4">
                                            <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">Dinner</h2>
                                            <p className="text-sm text-gray-900 mt-2">Time: 07:00 PM</p>
                                            <p className="leading-relaxed">Enjoy a delicious dinner onboard.</p>
                                        </div>
                                    </div>
                                    <div className="flex relative pb-12">
                                        <div className="h-full w-6 absolute inset-0 flex items-center justify-center">
                                            <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
                                        </div>
                                        <div className="shrink-0 w-6 h-6 rounded-full bg-blue-500 inline-flex items-center justify-center text-white relative">
                                            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                                        </div>
                                        <div className="grow pl-4">
                                            <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">Bed Time</h2>
                                            <p className="text-sm text-gray-900 mt-2">Time: 10:00 PM</p>
                                            <p className="leading-relaxed">Guests are not permitted to remain or sleep outside the rooms after 10:00 PM.</p>
                                        </div>
                                    </div>
                                    <div className="flex relative pb-12">
                                        <div className="h-full w-6 absolute inset-0 flex items-center justify-center">
                                            <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
                                        </div>
                                        <div className="shrink-0 w-6 h-6 rounded-full bg-blue-500 inline-flex items-center justify-center text-white relative">
                                            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                                        </div>
                                        <div className="grow pl-4">
                                            <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">Sunrise Time</h2>
                                            <p className="leading-relaxed">Wake up to a bright day and enjoy the sunrise with a cup of coffee.</p>
                                        </div>
                                    </div>
                                    <div className="flex relative pb-12">
                                        <div className="h-full w-6 absolute inset-0 flex items-center justify-center">
                                            <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
                                        </div>
                                        <div className="shrink-0 w-6 h-6 rounded-full bg-blue-500 inline-flex items-center justify-center text-white relative">
                                            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                                        </div>
                                        <div className="grow pl-4">
                                            <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">Cruising</h2>
                                            <p className="text-sm text-gray-900 mt-2">Time: 07:00 AM</p>
                                            <p className="leading-relaxed">Continue cruising through the backwaters and enjoy sightseeing.</p>
                                        </div>
                                    </div>
                                    <div className="flex relative pb-12">
                                        <div className="h-full w-6 absolute inset-0 flex items-center justify-center">
                                            <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
                                        </div>
                                        <div className="shrink-0 w-6 h-6 rounded-full bg-blue-500 inline-flex items-center justify-center text-white relative">
                                            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                                        </div>
                                        <div className="grow pl-4">
                                            <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">Breakfast</h2>
                                            <p className="text-sm text-gray-900 mt-2">Time: 08:00 AM</p>
                                            <p className="leading-relaxed">Enjoy a delicious breakfast onboard.</p>
                                        </div>
                                    </div>
                                    <div className="flex relative">
                                        <div className="shrink-0 w-6 h-6 rounded-full bg-blue-500 inline-flex items-center justify-center text-white relative">
                                            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                                        </div>
                                        <div className="grow pl-4">
                                            <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">Checkout</h2>
                                            <p className="text-sm text-gray-900 mt-2">Time: 09:00 AM</p>
                                            <p className="leading-relaxed">Check out by 9:00 AM to conclude your houseboat experience.</p>
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="text-center mt-4">
                                <button
                                    onClick={toggleShowMore}
                                    className="text-blue-500 hover:underline cursor-pointer"
                                >
                                    {showMore ? 'See Less' : 'See More'}
                                </button>
                            </div>
                        </div>
                        <div className='w-full'>
                            <AdditionalInfo />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SharingNightStaySteps;