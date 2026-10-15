import DocsShell from '@/components/docs/DocsShell';
import { withBase } from '@/lib/base';
import { docsMetadata } from '@/lib/seo';

// Ported from src/pages/privacy.astro.

export const metadata = docsMetadata({
  title: 'Privacy Policy',
  description:
    'EGCSite privacy policy. No personal data collected. No cookies. GoatCounter analytics only.',
  route: 'privacy/',
});

export default function PrivacyPage() {
  return (
    <DocsShell current="privacy">
      <div className="pb-2 mb-8 border-b border-gray-200 dark:border-gray-800">
        <p className="text-xs font-semibold uppercase tracking-widest text-egc-600 dark:text-egc-400 mb-2">
          Legal
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Privacy Policy
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Effective date: June 16, 2026. Last updated: September 20, 2026.
        </p>
      </div>

      <section className="mb-10 prose prose-sm dark:prose-invert max-w-none">
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
          This site (
          <strong className="text-gray-900 dark:text-white">fmarzochi.github.io/EGCSite</strong>) is
          the official documentation and marketing website for{' '}
          <a
            href="https://github.com/Fmarzochi/EGC"
            target="_blank"
            rel="noopener noreferrer"
            className="text-egc-600 dark:text-egc-400 hover:underline"
          >
            EGC - Extended Global Context
          </a>
          , an open-source project. This policy explains what data is collected when you visit this
          site.
        </p>

        {/* TL;DR card */}
        <div className="rounded-xl border border-egc-500/20 bg-egc-500/5 dark:bg-egc-500/10 p-5 mb-8">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">TL;DR</h2>
          <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-egc-500 mt-0.5 shrink-0">✓</span> No personal data collected
            </li>
            <li className="flex items-start gap-2">
              <span className="text-egc-500 mt-0.5 shrink-0">✓</span> No cookies, no tracking
              pixels, no fingerprinting
            </li>
            <li className="flex items-start gap-2">
              <span className="text-egc-500 mt-0.5 shrink-0">✓</span> No account or registration
              required
            </li>
            <li className="flex items-start gap-2">
              <span className="text-egc-500 mt-0.5 shrink-0">✓</span> Analytics are aggregate-only
              and privacy-first
            </li>
            <li className="flex items-start gap-2">
              <span className="text-egc-500 mt-0.5 shrink-0">✓</span> No data is sold or shared with
              third parties
            </li>
          </ul>
        </div>

        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">What we collect</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
          We collect <strong className="text-gray-900 dark:text-white">no personal data</strong>.
          There are no forms, no login, no newsletter signup, and no user accounts on this site.
        </p>

        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Analytics</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
          This site uses{' '}
          <a
            href="https://www.goatcounter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-egc-600 dark:text-egc-400 hover:underline"
          >
            GoatCounter
          </a>
          , an open-source, privacy-first analytics tool. GoatCounter:
        </p>
        <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400 mb-4 ml-4">
          <li className="flex items-start gap-2">
            <span className="shrink-0">-</span> Does{' '}
            <strong className="text-gray-900 dark:text-white">not</strong> use cookies
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">-</span> Does{' '}
            <strong className="text-gray-900 dark:text-white">not</strong> collect IP addresses or
            any personally identifiable information
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">-</span> Does{' '}
            <strong className="text-gray-900 dark:text-white">not</strong> fingerprint devices or
            browsers
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">-</span> Collects only aggregate page view counts and
            referrer domains
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">-</span> Is GDPR and LGPD compliant by design, requiring no
            consent banner
          </li>
        </ul>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
          The analytics dashboard is hosted at{' '}
          <a
            href="https://egc.goatcounter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-egc-600 dark:text-egc-400 hover:underline"
          >
            egc.goatcounter.com
          </a>
          . GoatCounter&apos;s own privacy policy applies to data processed by their service.
        </p>

        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">RSS feed</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
          This site provides an{' '}
          <a href={withBase('rss.xml')} className="text-egc-600 dark:text-egc-400 hover:underline">
            RSS feed
          </a>{' '}
          for release announcements. Subscribing to the RSS feed does not send any data to us. Your
          RSS reader fetches the feed file directly from GitHub Pages.
        </p>

        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          Third-party services
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
          This site loads resources from:
        </p>
        <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400 mb-6 ml-4">
          <li className="flex items-start gap-2">
            <span className="shrink-0">-</span>{' '}
            <strong className="text-gray-900 dark:text-white">GitHub Pages</strong> - the hosting
            provider. GitHub&apos;s privacy policy applies to page delivery.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          EGC itself (the CLI tool)
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
          The EGC tool installed on your machine is local-first. All state is stored in{' '}
          <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">
            ~/.egc/
          </code>{' '}
          on your device. Nothing leaves your machine unless you turn on the optional anonymous
          usage ping, which is off by default, asks once, and sends one hit per install, init or
          doctor run carrying only the EGC version and the operating system. See the{' '}
          <a
            href="https://github.com/Fmarzochi/EGC/blob/main/.github/SECURITY.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-egc-600 dark:text-egc-400 hover:underline"
          >
            Security policy
          </a>{' '}
          for details.
        </p>

        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Contact</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Questions about this policy? Email{' '}
          <a
            href="mailto:fmarzochi@gmail.com"
            className="text-egc-600 dark:text-egc-400 hover:underline"
          >
            fmarzochi@gmail.com
          </a>{' '}
          or open an issue at{' '}
          <a
            href="https://github.com/Fmarzochi/EGCSite/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-egc-600 dark:text-egc-400 hover:underline"
          >
            github.com/Fmarzochi/EGCSite
          </a>
          .
        </p>
      </section>
    </DocsShell>
  );
}
