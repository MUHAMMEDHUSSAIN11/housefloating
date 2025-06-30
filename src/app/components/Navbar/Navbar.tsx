'use client'

import React from 'react'
import Container from '../Misc/Container';
import Logo from './Logo';
import RightContent from './RightContent';
import NewMiddleContent from './NewMiddleContent';
import { usePathname } from 'next/navigation';
import NavbarIcons from './NavbarIcons';

const Navbar = () => {
  const pathname = usePathname();
  const isMainPage = pathname === '/boats';
  
  return (
    <div className="fixed w-full bg-white z-50 shadow-sm">
      <div className=" border-b-[1px]">
        <Container>
          {/* Desktop Layout */}
          {/* <div className="hidden md:flex flex-row items-center justify-between gap-3">
            <Logo />
            <div className="">
              <NewMiddleContent />
            </div>
            <RightContent />
          </div> */}

          {/* Desktop Layout */}
          <div className="hidden md:flex flex-row items-center justify-between gap-3">
            <Logo />
            <div >
              <NewMiddleContent />
            </div>
            <div className="flex flex-row items-center gap-4">
              <NavbarIcons />
              <RightContent />
            </div>
          </div>
          
          {/* Mobile Layout */}
          <div className="md:hidden">
            {/* Top row: Logo and Right Content */}
            <div className="flex flex-row items-center justify-between mb-4">
              <Logo />
              <RightContent />
            </div>
            
            {/* Bottom row: Middle Content */}
            <div className="flex justify-center">
              <NewMiddleContent />
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}

export default Navbar;