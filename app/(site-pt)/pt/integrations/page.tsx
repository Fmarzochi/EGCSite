import Integrations, { integrationsMetadata } from '@/components/pages/Integrations';
import { docsMetadata } from '@/lib/seo';

export const metadata = docsMetadata({ ...integrationsMetadata('pt'), route: 'pt/integrations/' });

export default function IntegrationsPagePt() {
  return <Integrations lang="pt" />;
}
