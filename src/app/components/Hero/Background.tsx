import React from 'react'
import MiddleContent from '../Navbar/MiddleContent'


// bg-fixed-- add this if bg image needs to be fixed..

const Background = () => {
  return (
    <div className="relative bg-cover bg-no-repeat bg-fixed bg-center h-screen">
      {/* Background Image */}
      <img src="/images/try.jpg" alt="Hero background image" className="absolute inset-0 object-cover w-full h-full"/>
      <div className="absolute inset-0 bg-black/20 flex flex-col justify-center items-center lg:items-start lg:pl-16">
        <div className="text-center mt-36 lg:text-left">
          <h1 className="text-white sm:text-5xl md:text-4xl lg:text-5xl xl:text-5xl font-sans font-semibold leading-tight">
            Discover Alleppey's<br/> Stunning Houseboats Online
          </h1>
        </div>
        <div className="mt-5 lg:hidden">
          <MiddleContent />
        </div>
      </div>
    </div>
  );
};

export default Background;



