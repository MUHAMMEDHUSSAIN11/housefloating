'use client';

import React from 'react';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import * as NProgress from "nprogress";

const Logo = () => {
  const handlePush = () => {
    router.push("/");
    NProgress.start();
    NProgress.done();
  };

  const router = useRouter();
  return (
    <div onClick={() => handlePush()}>
        <Image src= "/images/hf.jpg" alt="logo" className="block cursor-pointer" height={100} width={200}/>
        </div>
  );
};


export default Logo;