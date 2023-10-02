'use client'
import React from 'react'
import Container from '../Misc/Container';
import Logo from './Logo';
import RightContent from './RightContent';
import MiddleContent from './MiddleContent';
import { Session } from 'next-auth';
import { AuthStateHook } from 'react-firebase-hooks/auth';




const Navbar = () => {
  return (
    <div className="fixed w-full bg-white z-50 shadow-sm">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
            <Logo />
             <div className="hidden lg:block">
              <MiddleContent/>
            </div> 
           <RightContent />
          </div>
        </Container>
      </div>
    </div>

  )
}

export default Navbar;




