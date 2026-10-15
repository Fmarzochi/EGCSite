import HomePage from '@/components/home/HomePage';
import { homeMetadata } from '@/components/home/HomeRoot';

export const metadata = homeMetadata('en');

export default function HomeEn() {
  return <HomePage lang="en" />;
}
