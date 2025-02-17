
// import React from 'react';
// import { Quicksand } from 'next/font/google';
// import MiddleContent from '../Navbar/MiddleContent';

// // Configure the Quicksand font
// const quicksand = Quicksand({
//   subsets: ['latin'],
//   weight: ['400', '500', '600', '700'], // Include the font weights you need
// });

// // // Animation variants
// // const textVariants = {
// //   hidden: { opacity: 0, y: -50 }, // Initial state (hidden)
// //   visible: { opacity: 1, y: 0, transition: { duration: 1.5, ease: "easeOut" } }, // Animate to visible
// // };

// const Background: React.FC = () => {
//   return (
//     <div className="relative bg-cover bg-no-repeat bg-fixed bg-center h-screen">
//       {/* Background Image */}
//       <img
//         src="/images/try.jpg"
//         alt="Hero background image"
//         className="absolute inset-0 object-cover w-full h-full"
//       />
//       <div className="absolute inset-0 bg-black/20 flex flex-col justify-center items-center lg:items-start lg:pl-16">
//         <div className="text-center mt-36 lg:text-left">
//           <h1
//             className={`${quicksand.className} text-white sm:text-5xl md:text-4xl lg:text-5xl xl:text-5xl font-semibold leading-tight`}>
//             Discover Alleppey's<br /> Stunning Houseboats Online
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


"use client";

import { motion } from "framer-motion";
import { Quicksand } from "next/font/google";
import MiddleContent from "../Navbar/MiddleContent";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Animation variants for the text
const textVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.5, ease: "easeOut" } },
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
      
      {/* Stronger Dark Overlay for Better Contrast */}
      <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center lg:items-start lg:pl-16">
        <div className="text-center mt-36 lg:text-left">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className={`${quicksand.className} text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-center lg:text-left `}>
            Discover Alleppey's <br /> Stunning Houseboats Online
          </motion.h1>
        </div>

        <div className="mt-5 lg:hidden">
          <MiddleContent />
        </div>
      </div>
    </div>
  );
};

export default Background;




