'use client';

import { useDarkMode } from '@/hooks/useDarkMode';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { darkMode } = useDarkMode();

  return (
    <div className={darkMode ? 'app dark-mode' : 'app'}>
      <Header />
      <main className="container">
        {children}
      </main>
      <Footer />
    </div>
  );
} 