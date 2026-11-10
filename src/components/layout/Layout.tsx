import React from 'react';
import type { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { AiChatDrawer } from './AiChatDrawer';
import { UnifiedSearchModal } from '../modals/UnifiedSearchModal';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="app-main">
        {children}
      </main>
      <BottomNav />
      <AiChatDrawer />
      <UnifiedSearchModal />
    </>
  );
};
