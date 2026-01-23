'use client';

import { FaPhone, FaHandshake, FaSnowflake } from 'react-icons/fa';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { BsFillCartCheckFill } from 'react-icons/bs';
import { Radio } from 'lucide-react';


const WhySection = () => {
    return (
        <div className="">
            <div className="container">
                {/* <div className="text-center pt-56 md:pt-40 "> */}
                <div className="text-center">
                    <h2 className="text-3xl font-sans font-semibold mb-5 pb-4">Why Book with Housefloating</h2>
                </div>
                <div className="hidden sm:block"> {/* Hide carousel for screens larger than sm */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-500 text-white rounded-full p-3 inline-flex">
                                <Radio size={25} />
                            </div>
                            <h3 className="text-xl mt-4 font-medium">Live Availability</h3>
                            <p className="text-gray-700 mt-2">Real time boat availability with in 10 seconds</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-blue-500 text-white rounded-full p-3 inline-flex">
                                <FaHandshake size={25} />
                            </div>
                            <h3 className="text-xl mt-4 font-medium">Best Prices</h3>
                            <p className="text-gray-700 mt-2">Our prices are unbeatable</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-blue-500 text-white rounded-full p-3 inline-flex">
                                <BsFillCartCheckFill size={25} />
                            </div>
                            <h3 className="text-xl mt-4 font-medium">Easy Booking</h3>
                            <p className="text-gray-700 mt-2">Booking houseboats in alleppey <br /> has never been easier</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-blue-500 text-white rounded-full p-3 inline-flex">
                                <FaSnowflake size={25} />
                            </div>
                            <h3 className="text-xl mt-4 font-medium">Wide variety </h3>
                            <p className="text-gray-700 mt-2">Choose from wide variety of houseboats</p>
                        </div>
                        {/* Item 4 */}
                        <div className="text-center">
                            <div className="bg-blue-500 text-white rounded-full p-3 inline-flex">
                                <FaPhone size={25} />
                            </div>
                            <h3 className="text-xl mt-4 font-medium">Continuous Support</h3>
                            <p className="text-gray-700 mt-2">We're always here to help you,<br /> whenever you need it</p>
                        </div>
                    </div>
                </div>
                <div className="sm:hidden"> {/* Show carousel for sm screens */}
                    <Carousel showThumbs={false} showIndicators={false} showArrows={false}  autoPlay={true} infiniteLoop={true}>
                        <div className="text-center">
                            <div className="bg-blue-500 text-white rounded-full p-3 inline-flex">
                                <Radio size={25} />
                            </div>
                            <h3 className="text-xl mt-4 font-semibold">Live Availability</h3>
                            <p className="text-gray-700 mt-2">Real time boat availability with in 10 seconds</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-blue-500 text-white rounded-full p-3 inline-flex">
                                <FaHandshake size={25} />
                            </div>
                            <h3 className="text-xl mt-4 font-semibold">Best Prices</h3>
                            <p className="text-gray-700 mt-2">Our prices are unbeatable</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-blue-500 text-white rounded-full p-3 inline-flex">
                                <BsFillCartCheckFill size={25} />
                            </div>
                            <h3 className="text-xl mt-4 font-semibold">Easy Booking</h3>
                            <p className="text-gray-700 mt-2">Explore a wide range of houseboats</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-blue-500 text-white rounded-full p-3 inline-flex">
                                <FaSnowflake size={25} />
                            </div>
                            <h3 className="text-xl mt-4 font-semibold">Wide variety </h3>
                            <p className="text-gray-700 mt-2">Choose from extensive variety of houseboats</p>

                        </div>
                        <div className="text-center">
                            <div className="bg-blue-500 text-white rounded-full p-3 inline-flex">
                                <FaPhone size={25} />
                            </div>
                            <h3 className="text-xl mt-4 font-semibold">Continuous Support</h3>
                            <p className="text-gray-700 mt-2">We're always here to help you, whenever you need it</p>
                        </div>
                    </Carousel>
                </div>
            </div>
        </div>
    );
}


export default WhySection

