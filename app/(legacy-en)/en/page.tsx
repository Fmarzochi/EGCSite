import { withBase } from '@/lib/base';

// The old English home address: the layout sends the visitor to /, this link covers a browser
// that follows neither the meta refresh nor the script.

export default function LegacyEnHome() {
  return (
    <p>
      The English home moved to <a href={withBase('')}>fmarzochi.github.io/EGCSite</a>.
    </p>
  );
}
