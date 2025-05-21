"use client";

import { useSession } from "next-auth/react";
import UserMenu from './UserMenu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NavbarUserMenu() {
  const { data: session } = useSession();

  if (session) {
    return <UserMenu user={session.user} />;
  }

  return (
    <>
      <Link href="/auth/signin">
        <Button variant="ghost" className="hidden sm:flex">
          Sign In
        </Button>
      </Link>
      <Link href="/auth/signup">
        <Button>Sign Up</Button>
      </Link>
    </>
  );
}