import Guardian, { guardianMetadata } from '@/components/pages/Guardian';
import { docsMetadata } from '@/lib/seo';

export const metadata = docsMetadata({ ...guardianMetadata('en'), route: 'docs/guardian/' });

export default function GuardianPage() {
  return <Guardian lang="en" />;
}
