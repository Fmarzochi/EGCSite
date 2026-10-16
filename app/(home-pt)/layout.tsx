import type { ReactNode } from 'react';
import HomeRoot, { homeViewport } from '@/components/home/HomeRoot';

export const viewport = homeViewport;

export default function HomePtLayout({ children }: { children: ReactNode }) {
  return <HomeRoot lang="pt">{children}</HomeRoot>;
}
