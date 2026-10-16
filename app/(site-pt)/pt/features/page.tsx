import Features, { featuresMetadata } from '@/components/pages/Features';
import { docsMetadata } from '@/lib/seo';

export const metadata = docsMetadata({ ...featuresMetadata('pt'), route: 'pt/features/' });

export default function FeaturesPagePt() {
  return <Features lang="pt" />;
}
