import GetStarted, { getStartedMetadata } from '@/components/pages/GetStarted';
import { docsMetadata } from '@/lib/seo';

export const metadata = docsMetadata({ ...getStartedMetadata('en'), route: 'get-started/' });

export default function GetStartedPage() {
  return <GetStarted lang="en" />;
}
