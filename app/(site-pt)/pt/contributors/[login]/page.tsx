import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ContributorProfile, {
  contributorMetadata,
  contributorParams,
} from '@/components/pages/ContributorProfile';
import { highlights } from '@/data/contributors';
import { pageMetadata } from '@/lib/seo';

// One profile page per contributor listed in highlights, in Portuguese.

type Params = Promise<{ login: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return contributorParams();
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { login } = await params;
  const meta = contributorMetadata(login, 'pt');
  if (!meta) return {};
  return pageMetadata({ ...meta, route: `pt/contributors/${login}/` });
}

export default async function ContributorPagePt({ params }: { params: Params }) {
  const { login } = await params;
  if (!highlights[login]) notFound();
  return <ContributorProfile login={login} lang="pt" />;
}
