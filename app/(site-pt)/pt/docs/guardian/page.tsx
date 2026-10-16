import Guardian, { guardianMetadata } from '@/components/pages/Guardian';
import { docsMetadata } from '@/lib/seo';

export const metadata = docsMetadata({ ...guardianMetadata('pt'), route: 'pt/docs/guardian/' });

export default function GuardianPagePt() {
  return <Guardian lang="pt" />;
}
