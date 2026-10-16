import Privacy, { privacyMetadata } from '@/components/pages/Privacy';
import { docsMetadata } from '@/lib/seo';

export const metadata = docsMetadata({ ...privacyMetadata('en'), route: 'privacy/' });

export default function PrivacyPage() {
  return <Privacy lang="en" />;
}
