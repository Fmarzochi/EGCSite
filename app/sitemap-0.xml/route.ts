import { sitemapXml, xmlResponse } from '@/lib/feeds';

export const dynamic = 'force-static';

export function GET() {
  return xmlResponse(sitemapXml());
}
