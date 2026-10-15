import { homeMetadata } from '@/components/home/HomeRoot';

export const metadata = homeMetadata('en');

// Placeholder until phase 3 ports the home (src/pages/index.astro).
export default function HomeEn() {
  return (
    <main id="main-content" style={{ minHeight: '100vh', padding: '48px 16px', background: '#0A0D0C', color: '#F4F6F5', fontFamily: 'var(--font-jakarta)' }}>
      <p>Home in EN: comes in phase 3.</p>
    </main>
  );
}
