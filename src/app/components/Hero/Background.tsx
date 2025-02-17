
import React from 'react';
import { Quicksand } from 'next/font/google';
import MiddleContent from '../Navbar/MiddleContent';

// Configure the Quicksand font
const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Include the font weights you need
});

// // Animation variants
const textVariants = {
  hidden: { opacity: 0, y: -50 }, // Initial state (hidden)
  visible: { opacity: 1, y: 0, transition: { duration: 1.5, ease: "easeOut" } }, // Animate to visible
};

const Background: React.FC = () => {
  return (
    <div className="relative bg-cover bg-no-repeat bg-fixed bg-center h-screen">
      {/* Background Image */}
      <img
        src="/images/gb.jpg"
        alt="Hero background image"
        className="absolute inset-0 object-cover w-full h-full"
      />
      <div className="absolute inset-0 bg-black/20 flex flex-col justify-center items-center lg:items-start lg:pl-16">
        <div className="text-center mt-36 lg:text-left">
          <h1
            className={`${quicksand.className}  text-white sm:text-5xl md:text-4xl lg:text-5xl xl:text-5xl font-semibold leading-tight`}>
            Discover Alleppey's<br /> Stunning Houseboats Online
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


// bg-fixed-- add this if bg image needs to be fixed..

// const Background = () => {
//   return (
//     <div className="relative bg-cover bg-no-repeat bg-fixed bg-center h-screen">
//       {/* Background Image */}
//       <img src="/images/try.jpg" alt="Hero background image" className="absolute inset-0 object-cover w-full h-full"/>
//       <div className="absolute inset-0 bg-black/20 flex flex-col justify-center items-center lg:items-start lg:pl-16">
//         <div className="text-center mt-36 lg:text-left">
//           <h1 className="text-white sm:text-5xl md:text-4xl lg:text-5xl xl:text-5xl font-sans font-semibold leading-tight">
//             Discover Alleppey's<br/> Stunning Houseboats Online
//           </h1>
//         </div>
//         <div className="mt-5 lg:hidden">
//           <MiddleContent />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Background;



