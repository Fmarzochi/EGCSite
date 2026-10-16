import Cli, { cliMetadata } from '@/components/pages/Cli';
import { docsMetadata } from '@/lib/seo';

export const metadata = docsMetadata({ ...cliMetadata('en'), route: 'docs/cli/' });

export default function CliPage() {
  return <Cli lang="en" />;
}
