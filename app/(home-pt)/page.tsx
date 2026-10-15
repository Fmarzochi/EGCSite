import HomePage from '@/components/home/HomePage';
import { homeMetadata } from '@/components/home/HomeRoot';

export const metadata = homeMetadata('pt');

export default function HomePt() {
  return <HomePage lang="pt" />;
}
