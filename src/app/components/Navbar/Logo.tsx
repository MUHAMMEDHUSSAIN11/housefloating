'use client';

import React from 'react';
import Image from "next/image";
import { useRouter } from 'next/navigation';

const Logo = () => {
  const router = useRouter();
  
  const handlePush = () => {
    router.push("/");
  };
  
  return (
    <div onClick={handlePush} className="cursor-pointer">
      <Image 
        src="/images/hf.jpg" 
        alt="logo" 
        priority={true} 
        height={100} 
        width={200}
      />
    </div>
  );
};

export default Logo;