import React from 'react';
import Link from 'next/link';
import NavbarLogo from './NavbarLogo';
import NavbarUserMenu from './NavbarUserMenu';

export default function Navbar() {
  return (
    <header className="sticky top-0 border-b bg-background/95 backdrop-blur z-50">
      <div className="container flex items-center justify-between h-16 mx-auto px-4">
        <Link href="/" className="transition-colors hover:opacity-80">
          <NavbarLogo />
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/about" className="font-medium transition-colors hover:text-primary">
            About
          </Link>
          <Link href="/how-it-works" className="font-medium transition-colors hover:text-primary">
            How It Works
          </Link>
          <Link href="/contact" className="font-medium transition-colors hover:text-primary">
            Contact
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          <NavbarUserMenu />
        </div>
      </div>
    </header>
  );
}