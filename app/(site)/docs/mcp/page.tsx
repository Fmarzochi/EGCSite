import Mcp, { mcpMetadata } from '@/components/pages/Mcp';
import { docsMetadata } from '@/lib/seo';

export const metadata = docsMetadata({ ...mcpMetadata('en'), route: 'docs/mcp/' });

export default function McpPage() {
  return <Mcp lang="en" />;
}
