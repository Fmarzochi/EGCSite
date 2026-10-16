import Cli, { cliMetadata } from '@/components/pages/Cli';
import { docsMetadata } from '@/lib/seo';

export const metadata = docsMetadata({ ...cliMetadata('pt'), route: 'pt/docs/cli/' });

export default function CliPagePt() {
  return <Cli lang="pt" />;
}
