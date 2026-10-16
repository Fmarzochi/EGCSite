'use client';

import { useEffect, useRef, useState } from 'react';
import { withBase } from '@/lib/base';
import type { Lang } from '@/lib/lang';

// The recorded demo, played on the home itself. Until the visitor presses play, nothing loads
// from YouTube: the still is hosted on the site. Pressing play swaps it for the YouTube player
// (youtube-nocookie.com), started at once with the captions on in the page language. Without
// JS the still is a plain link to the video.

const VIDEO_ID = 'A8M_98WdI0Q';

export interface DemoVideoTexts {
  title: string;
  lede: string;
  note: string;
  play: string;
  frameTitle: string;
}

export default function DemoVideo({ lang, texts }: { lang: Lang; texts: DemoVideoTexts }) {
  const [playing, setPlaying] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const captions = lang === 'pt' ? 'pt' : 'en';
  const embed = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&cc_load_policy=1&cc_lang_pref=${captions}&hl=${captions}&rel=0`;

  // Keyboard users land on the player they just started instead of losing focus.
  useEffect(() => {
    if (playing) frame.current?.focus();
  }, [playing]);

  return (
    <div className="demo-video">
      {playing ? (
        <div className="demo-video__media">
          <iframe
            ref={frame}
            src={embed}
            title={texts.frameTitle}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      ) : (
        <a
          className="demo-video__media"
          href={`https://www.youtube.com/watch?v=${VIDEO_ID}`}
          aria-label={texts.play}
          onClick={(event) => {
            event.preventDefault();
            setPlaying(true);
          }}
        >
          <img src={withBase('demo/egc-demo-v2.jpg')} alt="" width="1280" height="720" loading="lazy" decoding="async" />
          <span className="demo-video__play" aria-hidden="true">
            {/* A triangle whose box is centred in the viewBox (x 5.75 to 18.25, y 4.5 to 19.5), so
                it sits on the circle's centre; the round stroke softens the corners evenly. */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5.75 4.5v15L18.25 12z" />
            </svg>
          </span>
        </a>
      )}
      <div className="demo-video__text">
        <b>{texts.title}</b>
        <p>{texts.lede}</p>
        <p className="demo-video__note">{texts.note}</p>
      </div>
    </div>
  );
}
