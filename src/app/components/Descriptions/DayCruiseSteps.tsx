'use client';

import React from 'react';
import AdditionalInfo from './AdditionalInfo';

const DayCruiseSteps = () => {
  return (
    <div>
      <section className="p-2 sm:pl-3 body-font">
        <div className="container flex flex-wrap">
          <div className="flex flex-wrap w-full">
            <div className="md:pr-10 md:py-6">
              <h1 className="font-sans font-semibold text-2xl text-gray-900 mb-5 ">Day Cruise Schedule</h1>
              <div className="flex relative pb-12">
                <div className="h-full w-6 absolute inset-0 flex items-center justify-center">
                  <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
                </div>
                <div className="shrink-0 w-6 h-6 rounded-full bg-blue-500 inline-flex items-center justify-center text-white relative">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                </div>
                <div className="grow pl-4">
                  <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">Cruise Starts</h2>
                  <p className="text-sm text-gray-900 mt-2">Time: 11:00 AM</p>
                  <p className="leading-relaxed">Board the cruise and begin your day adventure.</p>
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
                  <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">Lunch</h2>
                  <p className="text-sm text-gray-900 mt-2">Time: 12:00 PM</p>
                  <p className="leading-relaxed">Enjoy a delicious lunch onboard.</p>
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
                  <p className="leading-relaxed">Continue cruising through the backwaters and enjoy sightseeing.</p>
                </div>
              </div>
              <div className="flex relative">
                <div className="shrink-0 w-6 h-6 rounded-full bg-blue-500 inline-flex items-center justify-center text-white relative">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                </div>
                <div className="grow pl-4">
                  <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">Checkout</h2>
                  <p className="text-sm text-gray-900 mt-2">Time: 05:00 PM</p>
                  <p className="leading-relaxed">Conclude your houseboat experience.</p>
                </div>
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

export default DayCruiseSteps;
