import Contributors, { contributorsMetadata } from '@/components/pages/Contributors';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({ ...contributorsMetadata('en'), route: 'contributors/' });

export default function ContributorsPage() {
  return <Contributors lang="en" />;
}
