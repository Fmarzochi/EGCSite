import type { ReactNode } from 'react';
import HomeRoot, { homeViewport } from '@/components/home/HomeRoot';

export const viewport = homeViewport;

export default function HomeEnLayout({ children }: { children: ReactNode }) {
  return <HomeRoot lang="en">{children}</HomeRoot>;
}
