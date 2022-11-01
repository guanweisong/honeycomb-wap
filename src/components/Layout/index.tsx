import React from 'react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import BackToTop from '@/src/components/BackToTop';

export interface LayoutProps {
  children: React.ReactNode;
  currentMenu?: string;
}

export default function Layout(props: LayoutProps) {
  const { children, currentMenu } = props;
  return (
    <div className="min-h-full">
      <Header currentMenu={currentMenu} />
      <div className={'container px-2'}>{children}</div>
      <Footer />
      <BackToTop />
    </div>
  );
}
