import Privacy, { privacyMetadata } from '@/components/pages/Privacy';
import { docsMetadata } from '@/lib/seo';

export const metadata = docsMetadata({ ...privacyMetadata('pt'), route: 'pt/privacy/' });

export default function PrivacyPagePt() {
  return <Privacy lang="pt" />;
}
