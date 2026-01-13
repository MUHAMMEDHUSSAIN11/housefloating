'use client'

import Container from '../Misc/Container';
import Logo from './Logo';
import RightContent from './RightContent';
import SearchBar from './SearchBar';
import NavbarIcons from './NavbarIcons';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();
  const isListingPage = pathname?.startsWith('/listings/');

  return (
    <div className="fixed w-full bg-white z-50 shadow-sm">
      <div className=" border-b-[1px]">
        <Container>
          {/* Desktop Layout */}
          <div className="hidden lg:flex flex-row items-center justify-between gap-1">
            <Logo />
            <div className='hidden lg:block flex-1 max-w-2xl mx-1'>
              <SearchBar />
            </div>
            <div className="flex flex-row items-center gap-1">
              <NavbarIcons />
              <RightContent />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden">
            {/* Top row: Logo and Right Content */}
            <div className="flex flex-row items-center justify-between mb-1">
              <Logo />
              <RightContent />
            </div>

            <div className={`${isListingPage&&'hidden'} md:flex pb-1`}>
              <SearchBar />
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}

export default Navbar;