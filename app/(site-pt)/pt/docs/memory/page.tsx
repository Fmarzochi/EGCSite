import Memory, { memoryMetadata } from '@/components/pages/Memory';
import { docsMetadata } from '@/lib/seo';

export const metadata = docsMetadata({ ...memoryMetadata('pt'), route: 'pt/docs/memory/' });

export default function MemoryPagePt() {
  return <Memory lang="pt" />;
}
