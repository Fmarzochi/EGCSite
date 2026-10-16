import Security, { securityMetadata } from '@/components/pages/Security';
import { docsMetadata } from '@/lib/seo';

export const metadata = docsMetadata({ ...securityMetadata('pt'), route: 'pt/docs/security/' });

export default function SecurityPagePt() {
  return <Security lang="pt" />;
}
