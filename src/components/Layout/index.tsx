import React from 'react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';

export interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  const { children } = props;
  return (
    <div className="min-h-full">
      <Header />
      <div className={'container px-2'}>{children}</div>
      <Footer />
    </div>
  );
}
