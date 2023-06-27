"use client";
import React from 'react';
import Image from "next/image";

export type AvatarProps = {

}

const Avatar: React.FC<AvatarProps> = () => {
    return (
        <Image className="rounded-full" src="/images/placeholder.png" alt="Avatar" height="30" width="30"  />
    );
}


export default Avatar;