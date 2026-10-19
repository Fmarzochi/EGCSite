import type { ReactNode } from 'react';

// A docs section as a row of the home FAQ: a hairline, the heading as the <summary> and a
// circle with a chevron on the right. Native <details>, so it opens and closes without JS;
// DocsBehavior opens it when a #link or the URL hash points inside, and before printing.

interface DocsSectionProps {
  title: ReactNode;
  /** Anchor of the section, for the pages whose "On this page" links name their sections. */
  id?: string;
  open?: boolean;
  children: ReactNode;
}

export default function DocsSection({ title, id, open = false, children }: DocsSectionProps) {
  return (
    <section className="section docs-acc" id={id}>
      <details className="docs-acc__details" open={open || undefined}>
        <summary className="docs-acc__summary">
          <h2 className="docs-acc__title">{title}</h2>
          <i className="docs-acc__icon" aria-hidden="true">
            {/* Box centred in the viewBox (x 1.5 to 10.5, y 3.75 to 8.25), so it sits on the
                circle's centre in both directions. */}
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1.5 3.75 6 8.25l4.5-4.5" />
            </svg>
          </i>
        </summary>
        <div className="docs-acc__body">{children}</div>
      </details>
    </section>
  );
}
