'use client';

import React from 'react';
import {  MdCheckCircle, MdPayment } from 'react-icons/md';
import { FaAnchor } from 'react-icons/fa';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { IoIosBoat } from 'react-icons/io';

const HowToBookSection = () => {
  return (
    <div className="py-12">
      <div className="container">
        <div className="text-center pb-9">
          <h2 className="text-3xl font-sans font-semibold mb-5">How to Book a Houseboat in Alleppey</h2>
        </div>
        <div className="">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-blue-500 text-white rounded-full p-3 inline-flex">
                <IoIosBoat size={25}/>
              </div>
              <h3 className="text-xl mt-4 font-medium">Choose a Houseboat</h3>
              <p className="text-gray-700 mt-2">Find your ideal floating haven</p>
            </div>
            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-blue-500 text-white rounded-full p-3 inline-flex">
                <MdCheckCircle size={25} />
              </div>
              <h3 className="text-xl mt-4 font-medium">Booking Approval</h3>
              <p className="text-gray-700 mt-2">Submit your booking request for approval.</p>
            </div>
            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-blue-500 text-white rounded-full p-3 inline-flex">
                <MdPayment size={25} />
              </div>
              <h3 className="text-xl mt-4 font-medium">Payment</h3>
              <p className="text-gray-700 mt-2">Make the payment to confirm your reservation.</p>
            </div>
            {/* Step 4 */}
            <div className="text-center">
              <div className="bg-blue-500 text-white rounded-full p-3 inline-flex">
              <FaAnchor size={25} />
              </div>
              <h3 className="text-xl mt-4 font-medium">Enjoy the Ride </h3>
              <p className="text-gray-700 mt-2">Embark on an unforgettable adventure </p>
            </div>
          </div>
        </div>
        {/* <div className="sm:hidden">
          <Carousel showThumbs={false} showArrows={false} autoPlay={true} infiniteLoop={true}>
            <div className="text-center">
              <div className="bg-blue-500 text-white rounded-full p-3 inline-flex">
                <IoIosBoat size={25} />
              </div>
              <h3 className="text-xl mt-4 font-semibold">Choose a Houseboat</h3>
              <p className="text-gray-700 mt-2">Browse our selection of houseboats and choose the one you like.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-500 text-white rounded-full p-3 inline-flex">
                <MdCheckCircle size={25} />
              </div>
              <h3 className="text-xl mt-4 font-semibold">Booking Approval</h3>
              <p className="text-gray-700 mt-2">Submit your booking request for approval.</p>
            </div>
           
            <div className="text-center">
              <div className="bg-blue-500 text-white rounded-full p-3 inline-flex">
                <MdPayment size={25} />
              </div>
              <h3 className="text-xl mt-4 font-semibold">Payment</h3>
              <p className="text-gray-700 mt-2">Make the payment to confirm your reservation.</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-500 text-white rounded-full p-3 inline-flex">
                <FaAnchor size={25} />
              </div>
              <h3 className="text-xl mt-4 font-semibold">Enjoy the Ride </h3>
              <p className="text-gray-700 mt-2">Our support team is available whenever you need assistance.</p>
            </div>
          </Carousel>
        </div> */}
      </div>
    </div>
  );
}

export default HowToBookSection;

