import Faq, { faqMetadata } from '@/components/pages/Faq';
import { docsMetadata } from '@/lib/seo';

export const metadata = docsMetadata({ ...faqMetadata('pt'), route: 'pt/docs/faq/' });

export default function FaqPagePt() {
  return <Faq lang="pt" />;
}
