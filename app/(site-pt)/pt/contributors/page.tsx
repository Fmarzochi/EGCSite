import Contributors, { contributorsMetadata } from '@/components/pages/Contributors';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ ...contributorsMetadata('pt'), route: 'pt/contributors/' });

export default function ContributorsPagePt() {
  return <Contributors lang="pt" />;
}
