import { ReactNode } from 'react';
import './app.scss';

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return children;
}
