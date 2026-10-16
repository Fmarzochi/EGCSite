import Mcp, { mcpMetadata } from '@/components/pages/Mcp';
import { docsMetadata } from '@/lib/seo';

export const metadata = docsMetadata({ ...mcpMetadata('pt'), route: 'pt/docs/mcp/' });

export default function McpPagePt() {
  return <Mcp lang="pt" />;
}
