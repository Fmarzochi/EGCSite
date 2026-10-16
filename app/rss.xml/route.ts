import { rssXml, xmlResponse } from '@/lib/feeds';

export const dynamic = 'force-static';

export function GET() {
  return xmlResponse(rssXml(), 'application/rss+xml');
}
