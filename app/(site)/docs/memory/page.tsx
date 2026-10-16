import Memory, { memoryMetadata } from '@/components/pages/Memory';
import { docsMetadata } from '@/lib/seo';

export const metadata = docsMetadata({ ...memoryMetadata('en'), route: 'docs/memory/' });

export default function MemoryPage() {
  return <Memory lang="en" />;
}
