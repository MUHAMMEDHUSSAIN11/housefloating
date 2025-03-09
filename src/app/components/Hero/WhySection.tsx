'use client';

import React from 'react';
import { MdCheckCircle, MdPayment } from 'react-icons/md';
import { FaAnchor } from 'react-icons/fa';
import { IoIosBoat } from 'react-icons/io';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const steps = [
  { icon: <IoIosBoat size={25} />, title: "Choose a Houseboat", desc: "Find your ideal floating haven" },
  { icon: <MdCheckCircle size={25} />, title: "Booking Confirmation", desc: "Submit your booking request for confirmation." },
  { icon: <MdPayment size={25} />, title: "Payment", desc: "Make the payment to confirm your reservation." },
  { icon: <FaAnchor size={25} />, title: "Enjoy the Ride", desc: "Embark on an unforgettable adventure." },
];

const HowToBookSection = () => {
  return (
    <div className="py-12">
      <div className="container">
        <div className="text-center pb-9">
          <h2 className="text-3xl font-sans font-semibold mb-5">
            Booking a Houseboat in Alleppey Made Easy
          </h2>
        </div>

        {/* Mobile: Carousel | Desktop: Grid */}
        <div className="block md:hidden">
          <Carousel showThumbs={false} showStatus={false} autoPlay infiniteLoop>
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-500 text-white rounded-full p-3 inline-flex">
                  {step.icon}
                </div>
                <h3 className="text-xl mt-4 font-medium">{step.title}</h3>
                <p className="text-gray-700 mt-2">{step.desc}</p>
              </div>
            ))}
          </Carousel>
        </div>

        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-500 text-white rounded-full p-3 inline-flex">
                {step.icon}
              </div>
              <h3 className="text-xl mt-4 font-medium">{step.title}</h3>
              <p className="text-gray-700 mt-2">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowToBookSection;

