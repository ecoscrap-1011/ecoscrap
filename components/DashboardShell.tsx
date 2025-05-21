import { ReactNode } from 'react';
import DashboardSidebar from './DashboardSidebar';
import { UserRole } from '@/models/User';

interface DashboardShellProps {
  children: ReactNode;
  role: UserRole;
  userName?: string;
}

export default function DashboardShell({ 
  children, 
  role, 
  userName = 'User' 
}: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar role={role} userName={userName} />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
        <footer className="border-t p-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} EcoScrap. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}