import Features, { featuresMetadata } from '@/components/pages/Features';
import { docsMetadata } from '@/lib/seo';

export const metadata = docsMetadata({ ...featuresMetadata('en'), route: 'features/' });

export default function FeaturesPage() {
  return <Features lang="en" />;
}
