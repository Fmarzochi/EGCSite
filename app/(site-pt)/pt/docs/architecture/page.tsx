import Architecture, { architectureMetadata } from '@/components/pages/Architecture';
import { docsMetadata } from '@/lib/seo';

export const metadata = docsMetadata({
  ...architectureMetadata('pt'),
  route: 'pt/docs/architecture/',
});

export default function ArchitecturePagePt() {
  return <Architecture lang="pt" />;
}
