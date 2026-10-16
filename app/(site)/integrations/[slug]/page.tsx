import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import IntegrationDetail, {
  findIntegration,
  integrationMetadata,
  integrationParams,
} from '@/components/pages/IntegrationDetail';
import { docsMetadata } from '@/lib/seo';

// One static page per tool.

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return integrationParams();
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const integration = findIntegration((await params).slug);
  if (!integration) return {};
  return docsMetadata({
    ...integrationMetadata(integration, 'en'),
    route: `integrations/${integration.slug}/`,
  });
}

export default async function IntegrationPage({ params }: { params: Params }) {
  const integration = findIntegration((await params).slug);
  if (!integration) notFound();
  return <IntegrationDetail integration={integration} lang="en" />;
}
