import { sitemapIndexXml, xmlResponse } from '@/lib/feeds';

export const dynamic = 'force-static';

export function GET() {
  return xmlResponse(sitemapIndexXml());
}
