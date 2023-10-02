
import React from 'react';
import Image from 'next/image';

const ExperienceSection = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="lg:flex lg:items-center">
          <div className="lg:w-1/2">
            <div className="text-center lg:text-left lg:px-2">
              <h2 className="text-2xl font-semibold font-sans sm:text-3xl">
                Experience the Tranquil Beauty of <br />Alleppey's Backwaters
              </h2>
              <p className="mt-4 text-lg text-gray-700 font-sans text-justify px-1">
                Immerse yourself in the serene and captivating world of Alleppey's backwaters. Aboard our traditional houseboats, you'll embark on a journey of tranquility and awe as you navigate the winding waterways surrounded by lush greenery and picturesque landscapes.
              </p>
            </div>
          </div>
          <div className="mt-10 lg:mt-0 lg:w-1/2 lg:pl-12">
            <div className="relative w-auto h-auto mx-auto lg:ml-10 text-center">
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
