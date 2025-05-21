"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import NavbarLogo from './NavbarLogo';
import { UserRole } from '@/lib/userRole'; // updated import here
import { 
  LayoutDashboard, 
  ClipboardList, 
  Settings, 
  Users, 
  Package, 
  FileText, 
  LifeBuoy,
  LogOut, 
  Menu, 
  X
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

interface DashboardSidebarProps {
  role: UserRole;
  userName: string;
}

export default function DashboardSidebar({ role, userName }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const basePath = role === UserRole.SELLER ? "/user" : `/${role.toLowerCase()}`;

  const getNavItems = () => {
    const commonItems = [
      {
        title: 'Settings',
        href: `${basePath}/settings`,
        icon: <Settings className="h-5 w-5" />,
      },
      {
        title: 'Help & Support',
        href: `${basePath}/support`,
        icon: <LifeBuoy className="h-5 w-5" />,
      },
    ];
    
    switch (role) {
      case UserRole.ADMIN:
        return [
          {
            title: 'Dashboard',
            href: '/admin',
            icon: <LayoutDashboard className="h-5 w-5" />,
          },
          {
            title: 'Scrap Requests',
            href: '/admin/requests',
            icon: <ClipboardList className="h-5 w-5" />,
          },
          {
            title: 'Manage Users',
            href: '/admin/users',
            icon: <Users className="h-5 w-5" />,
          },
          {
            title: 'Material Types',
            href: '/admin/materials',
            icon: <Package className="h-5 w-5" />,
          },
          {
            title: 'Reports',
            href: '/admin/reports',
            icon: <FileText className="h-5 w-5" />,
          },
          ...commonItems,
        ];
      case UserRole.STAFF:
        return [
          {
            title: 'Dashboard',
            href: '/staff',
            icon: <LayoutDashboard className="h-5 w-5" />,
          },
          {
            title: 'Assigned Pickups',
            href: '/staff/pickups',
            icon: <ClipboardList className="h-5 w-5" />,
          },
          {
            title: 'Completed Pickups',
            href: '/staff/completed',
            icon: <FileText className="h-5 w-5" />,
          },
          ...commonItems,
        ];
      case UserRole.SELLER:
      default:
        return [
          {
            title: 'Dashboard',
            href: '/user',
            icon: <LayoutDashboard className="h-5 w-5" />,
          },
          {
            title: 'My Requests',
            href: '/user/requests',
            icon: <ClipboardList className="h-5 w-5" />,
          },
          ...commonItems,
        ];
    }
  };
  
  const navItems = getNavItems();
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const sidebarContent = (
    <>
      <div className="px-3 py-2">
        <div className="mb-10 flex h-[60px] items-center px-4">
          <NavbarLogo />
        </div>
        <div className="mb-4 px-4">
          <p className="text-xs font-semibold text-muted-foreground">
            {role.charAt(0) + role.slice(1).toLowerCase()}
          </p>
          <p className="font-medium">{userName}</p>
        </div>
        <div className="space-y-1 px-2">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                {item.icon}
                <span className="ml-2">{item.title}</span>
              </Button>
            </Link>
          ))}
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-2">Logout</span>
          </Button>
        </div>
      </div>
    </>
  );
  
  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="fixed inset-y-0 left-0 z-50 w-72 bg-background border-r shadow-lg">
            <ScrollArea className="h-full">
              {sidebarContent}
            </ScrollArea>
          </div>
        </div>
      )}
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-72 border-r bg-background">
        <ScrollArea className="flex-1">
          {sidebarContent}
        </ScrollArea>
      </div>
    </>
  );
}
