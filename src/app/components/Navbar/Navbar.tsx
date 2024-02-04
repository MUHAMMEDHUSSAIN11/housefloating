'use client'
import React from 'react'
import Container from '../Misc/Container';
import Logo from './Logo';
import RightContent from './RightContent';
import MiddleContent from './MiddleContent';
import { AuthStateHook } from 'react-firebase-hooks/auth';
import { usePathname } from 'next/navigation';




const Navbar = () => {

  const pathname = usePathname();
  const isMainPage = pathname === '/boats';
  return (
    <div className="fixed w-full bg-white z-50 shadow-sm">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
            <Logo />
            {!isMainPage && ( // Conditionally render MiddleContent if it's not the main page
              <div className="hidden lg:block">
                <MiddleContent />
              </div>
            )}
            <RightContent />
          </div>
        </Container>
      </div>
    </div>

  )
}

export default Navbar;




