
import React from 'react';
import Image from 'next/image';

const ExperienceSection = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="lg:flex lg:items-center">
          <div className="lg:w-1/2">
            <div className="text-center lg:text-left lg:px-2">
              <h3 className="text-2xl font-semibold font-sans sm:text-3xl">
                Experience the Tranquil Beauty of <br />Alleppey's Backwaters
              </h3>
              <p className="mt-4 text-lg text-gray-700 font-sans text-justify px-4 sm:px-6 lg:px-0">                
                Immerse yourself in the serene and captivating world of Alleppey's backwaters aboard our traditional houseboats. You'll embark on a journey of tranquillity and awe as you navigate the winding waterways surrounded by lush greenery and picturesque landscapes. Glide through the famous Kerala backwaters on a luxury houseboat in Alleppey and create unforgettable memories on Vembanad Lake.
              </p>
              <p className="mt-4 text-lg text-gray-700 font-sans text-justify px-4 sm:px-6 lg:px-0">
                Experience real-time boat availability within no time on the best houseboat in Alleppey. Our prices are unbeatable for luxury houseboat Alleppey and Alappuzha house boat options. Booking houseboats in Alleppey has never been easier with our wide variety of private and sharing boats. Choose from an extensive variety of houseboats that suit your needs. We provide continuous support whenever you need it. Book your Alappuzha boat house with confidence and enjoy a seamless Kerala backwaters experience.
              </p>
            </div>
          </div>
          <div className="mt-10 lg:mt-0 lg:w-1/2 lg:pl-12">
            <div className="relative w-auto h-auto mx-auto lg:ml-10 text-center px-4">
              <Image
                src="/images/canal.jpeg"
                alt="Alleppey Houseboat"
                width={500}
                height={500}
                className="rounded-xl ring-4 ring-gray-100 inline-block"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
