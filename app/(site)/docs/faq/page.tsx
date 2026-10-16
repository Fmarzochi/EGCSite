import Faq, { faqMetadata } from '@/components/pages/Faq';
import { docsMetadata } from '@/lib/seo';

export const metadata = docsMetadata({ ...faqMetadata('en'), route: 'docs/faq/' });

export default function FaqPage() {
  return <Faq lang="en" />;
}
