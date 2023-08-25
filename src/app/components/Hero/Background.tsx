import React from 'react'
import MiddleContent from '../Navbar/MiddleContent'


// bg-fixed-- add this if bg image needs to be fixed..

const Background = () => {
  return (
    <div className="relative bg-[url('/images/BG-cr.jpg')] bg-cover bg-no-repeat  bg-center h-screen">
      <div className="absolute inset-0 bg-black/20 flex flex-col justify-center items-center">
        <div className="text-center mt-36">
          <h1 className="text-white text-2xl sm:text-3xl md:text-5xl lg:text-5xl xl:text-6xl font-semibold leading-tight">
            Book your next houseboat trip online
          </h1>
        </div>
        <div className="mt-5 md:hidden">
          <MiddleContent />
        </div>
      </div>
    </div>
  )
}

export default Background