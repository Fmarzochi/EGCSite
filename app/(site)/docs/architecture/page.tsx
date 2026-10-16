import Architecture, { architectureMetadata } from '@/components/pages/Architecture';
import { docsMetadata } from '@/lib/seo';

export const metadata = docsMetadata({
  ...architectureMetadata('en'),
  route: 'docs/architecture/',
});

export default function ArchitecturePage() {
  return <Architecture lang="en" />;
}
