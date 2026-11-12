import React, { useEffect, useRef, useState } from 'react';
import type { Banner } from '@lucky/shared';

const AUTO_MS = 4500;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Home banner carousel: swipe (native scroll-snap), auto-advance, dots.
 * The shop owner manages the banners in the admin app; only live ones are passed in.
 */
export const BannerCarousel: React.FC<{ banners: Banner[]; onSelectTarget: (target: string) => void }> = ({
  banners,
  onSelectTarget,
}) => {
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const paused = useRef(false);

  const goTo = (i: number) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  useEffect(() => {
    if (banners.length < 2) return;
    const timer = window.setInterval(() => {
      if (paused.current || document.hidden) return;
      setIndex((cur) => {
        const next = (cur + 1) % banners.length;
        goTo(next);
        return next;
      });
    }, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [banners.length]);

  // Keep the index valid if a banner is removed live
  useEffect(() => {
    if (index >= banners.length) setIndex(0);
  }, [banners.length, index]);

  if (banners.length === 0) return null;

  return (
    <section style={{ padding: '0 20px 14px' }} aria-roledescription="carousel" aria-label="Offers">
      <div
        ref={scroller}
        onScroll={(e) => {
          const el = e.currentTarget;
          const i = Math.round(el.scrollLeft / el.clientWidth);
          if (i !== index) setIndex(i);
        }}
        onTouchStart={() => (paused.current = true)}
        onTouchEnd={() => window.setTimeout(() => (paused.current = false), 3000)}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          borderRadius: '22px',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {banners.map((b, i) => (
          <button
            key={b.id}
            onClick={() => b.target && onSelectTarget(b.target)}
            aria-label={[b.title, b.subtitle].filter(Boolean).join(' - ') || `Offer ${i + 1}`}
            style={{
              flex: '0 0 100%',
              scrollSnapAlign: 'start',
              position: 'relative',
              minHeight: '132px',
              border: 'none',
              padding: '18px 20px',
              textAlign: 'left',
              cursor: b.target ? 'pointer' : 'default',
              backgroundColor: '#E8F5F5',
              backgroundImage: b.image ? `url(${b.image})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'flex-end',
            }}
          >
            {/* dark scrim keeps the text readable on any photo */}
            <span
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(15,23,42,0.78) 0%, rgba(15,23,42,0.15) 70%)',
              }}
            />
            <span style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '2px', maxWidth: '85%' }}>
              {b.title && (
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2, fontFamily: "'Poppins', sans-serif" }}>
                  {b.title}
                </span>
              )}
              {b.subtitle && <span style={{ fontSize: '12px', fontWeight: 500, color: '#E2E8F0' }}>{b.subtitle}</span>}
            </span>
          </button>
        ))}
      </div>
      {banners.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '8px' }} aria-hidden>
          {banners.map((b, i) => (
            <span
              key={b.id}
              style={{
                width: i === index ? '18px' : '6px',
                height: '6px',
                borderRadius: '9999px',
                backgroundColor: i === index ? '#4AB7B6' : '#CBD5E1',
                transition: 'width 220ms ease, background-color 220ms ease',
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
};
