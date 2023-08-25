'use client';

import React from 'react';
import { MdHouseboat } from 'react-icons/md';
import {FaPhone, FaSnowflake} from 'react-icons/fa';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { BsFillCartCheckFill } from 'react-icons/bs';


const Wsection = () => {
    return (
        <div className="py-12">
            <div className="container">
                <div className="text-center pb-9">
                    <h2 className="text-3xl font-semibold mb-5">Why Book with Housefloating?</h2>
                </div>
                <div className="hidden sm:block"> {/* Hide carousel for screens larger than sm */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-500 text-white rounded-full p-3 inline-flex">
                                <MdHouseboat size={25} />
                            </div>
                            <h3 className="text-xl mt-4 font-semibold">Best Prices</h3>
                            <p className="text-gray-700 mt-2">Our prices are unbeatable</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-blue-500 text-white rounded-full p-3 inline-flex">
                                <FaSnowflake  size={25} />
                            </div>
                            <h3 className="text-xl mt-4 font-semibold">Scenic Beauty</h3>
                            <p className="text-gray-700 mt-2">Experience breathtaking views of Alleppey's backwaters</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-blue-500 text-white rounded-full p-3 inline-flex">
                                <FaPhone size={25}  />
                            </div>
                            <h3 className="text-xl mt-4 font-semibold">Full-Time Support</h3>
                            <p className="text-gray-700 mt-2">We provide 24/7 assistance for all your needs</p>
                        </div>

                        {/* Item 4 */}
                        <div className="text-center">
                            {/* Replace MdFourthIcon with the appropriate icon component */}
                            <div className="bg-blue-500 text-white rounded-full p-3 inline-flex">
                                <BsFillCartCheckFill size={25} />
                            </div>
                            <h3 className="text-xl mt-4 font-semibold">Easy Booking</h3>
                            <p className="text-gray-700 mt-2">Explore a wide range of houseboats</p>
                        </div>
                    </div>
                </div>
                <div className="sm:hidden"> {/* Show carousel for sm screens */}
                    <Carousel showThumbs={false} showArrows={false} autoPlay={true} infiniteLoop={true} >
                        {/* Item 1 */}
                        <div className="text-center">
                            {/* Replace MdHouseboat with the appropriate icon component */}
                            <div className="bg-blue-500 text-white rounded-full p-3 inline-flex">
                                <MdHouseboat size={25}/>
                            </div>
                            <h3 className="text-xl mt-4 font-semibold">Best Prices</h3>
                            <p className="text-gray-700 mt-2">Our prices are unbeatable</p>
                        </div>

                        {/* Item 2 */}
                        <div className="text-center">
                            {/* Replace MdAnotherIcon with the appropriate icon component */}
                            <div className="bg-blue-500 text-white rounded-full p-3 inline-flex">
                                <FaSnowflake size={25} />
                            </div>
                            <h3 className="text-xl mt-4 font-semibold">Scenic Beauty</h3>
                            <p className="text-gray-700 mt-2">Experience breathtaking views of Alleppey's backwaters</p>
                        </div>

                        {/* Item 3 */}
                        <div className="text-center">
                            {/* Replace MdThirdIcon with the appropriate icon component */}
                            <div className="bg-blue-500 text-white rounded-full p-3 inline-flex">
                                <FaPhone size={25} />
                            </div>
                            <h3 className="text-xl mt-4 font-semibold">Full-Time Support</h3>
                            <p className="text-gray-700 mt-2">We provide 24/7 assistance for all your needs</p>
                        </div>

                        {/* Item 4 */}
                        <div className="text-center">
                            {/* Replace MdFourthIcon with the appropriate icon component */}
                            <div className="bg-blue-500 text-white rounded-full p-3 inline-flex">
                            <BsFillCartCheckFill size={25} />
                            </div>
                            <h3 className="text-xl mt-4 font-semibold">Easy Booking</h3>
                            <p className="text-gray-700 mt-2">Explore a wide range of houseboats</p>
                        </div>
                    </Carousel>
                </div>
            </div>
        </div>
    );
}


export default Wsection

