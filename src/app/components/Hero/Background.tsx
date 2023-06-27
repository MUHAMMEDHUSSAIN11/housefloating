import React from 'react'

const Background = () => {
  return (
    <div className="relative bg-[url('/images/BG-cr.jpg')] bg-cover bg-no-repeat bg-center bg-fixed h-screen">
      <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center">
        <div className="text-center">
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mt-12 sm:mt-18 md:mt-22 lg:mt-26 xl:mt-32">
            Book your next houseboat trip online
          </h1>
          <p className="text-white text-base sm:text-lg md:text-xl lg:text-1xl xl:text-2xl mt-6 sm:mt-8 md:mt-10 lg:mt-12 xl:mt-14">
            Find best deals according to your budget
          </p>
        </div>
      </div>
    </div>
  )
}

export default Background