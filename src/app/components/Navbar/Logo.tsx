"use client";

import React from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";



export type LogoProps = {

}

const Logo: React.FC<LogoProps> = () => {
  const router = useRouter();
  return (
  
        <Image onClick={() => router.push('/')} src="/images/HF-logo.png" alt="logo" className="block cursor-pointer" height={100} width={200}
  />
    
  
  
  );
};


export default Logo;