'use client'

import React, { useRef, useState } from 'react'
import Container from '../Misc/Container';
import Logo from './Logo';
import RightContent from './RightContent';
import SearchBar from './SearchBar';
import NavbarIcons from './NavbarIcons';
const Navbar = () => {
   
  return (
    <div className="fixed w-full bg-white z-50 shadow-sm">
      <div className=" border-b-[1px]">
        <Container>
          {/* Desktop Layout */}
          <div className="hidden md:flex flex-row items-center justify-between gap-1">
            <Logo />
            <div className='hidden md:block flex-1 max-w-2xl mx-1'>
              <SearchBar/>
            </div>
            <div className="flex flex-row items-center gap-1">
              <NavbarIcons />
              <RightContent />
            </div>
          </div>
          
          {/* Mobile Layout */}
          <div className="md:hidden">
            {/* Top row: Logo and Right Content */}
            <div className="flex flex-row items-center justify-between mb-1">
              <Logo />
              <RightContent />
            </div>
            
            {/* Bottom row: Middle Content */}
            <div className="md:hidden pb-1">
              <SearchBar/>
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}

export default Navbar;