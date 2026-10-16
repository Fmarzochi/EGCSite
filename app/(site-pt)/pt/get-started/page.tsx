import GetStarted, { getStartedMetadata } from '@/components/pages/GetStarted';
import { docsMetadata } from '@/lib/seo';

export const metadata = docsMetadata({ ...getStartedMetadata('pt'), route: 'pt/get-started/' });

export default function GetStartedPagePt() {
  return <GetStarted lang="pt" />;
}
