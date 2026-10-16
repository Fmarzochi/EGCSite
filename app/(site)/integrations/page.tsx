import Integrations, { integrationsMetadata } from '@/components/pages/Integrations';
import { docsMetadata } from '@/lib/seo';

export const metadata = docsMetadata({ ...integrationsMetadata('en'), route: 'integrations/' });

export default function IntegrationsPage() {
  return <Integrations lang="en" />;
}
