import Security, { securityMetadata } from '@/components/pages/Security';
import { docsMetadata } from '@/lib/seo';

export const metadata = docsMetadata({ ...securityMetadata('en'), route: 'docs/security/' });

export default function SecurityPage() {
  return <Security lang="en" />;
}
