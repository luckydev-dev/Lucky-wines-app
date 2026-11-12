import React, { useRef, useState } from 'react';
import type { Product } from '@lucky/shared';

/** Swipeable photo strip with dots (native scroll-snap, no layout shift: fixed height). */
export const ImageGallery: React.FC<{ images: string[]; alt: string; overlay?: React.ReactNode }> = ({ images, alt, overlay }) => {
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const list = images.filter(Boolean);
  if (list.length === 0) list.push('');

  return (
    <div style={{ position: 'relative', width: '100%', height: '190px', borderRadius: '18px', overflow: 'hidden', backgroundColor: '#F1F5F9' }}>
      <div
        ref={ref}
        onScroll={(e) => {
          const el = e.currentTarget;
          const i = Math.round(el.scrollLeft / el.clientWidth);
          if (i !== index) setIndex(i);
        }}
        style={{ display: 'flex', height: '100%', overflowX: 'auto', scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
      >
        {list.map((src, i) => (
          <img
            key={`${src}-${i}`}
            src={src}
            alt={list.length > 1 ? `${alt} (photo ${i + 1} of ${list.length})` : alt}
            loading={i === 0 ? 'eager' : 'lazy'}
            style={{ flex: '0 0 100%', width: '100%', height: '100%', objectFit: 'cover', scrollSnapAlign: 'start' }}
          />
        ))}
      </div>
      {overlay}
      {list.length > 1 && (
        <div style={{ position: 'absolute', bottom: '8px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '5px' }} aria-hidden>
          {list.map((_, i) => (
            <span
              key={i}
              style={{
                width: i === index ? '16px' : '6px',
                height: '6px',
                borderRadius: '9999px',
                backgroundColor: i === index ? '#FFFFFF' : 'rgba(255,255,255,0.55)',
                transition: 'width 200ms ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const LOW_STOCK_AT = 5;

/** "Out of stock" / "Only 3 left" / nothing when plenty. */
export const StockNote: React.FC<{ stock: number }> = ({ stock }) => {
  if (stock > LOW_STOCK_AT) return null;
  const out = stock <= 0;
  return (
    <span
      style={{
        alignSelf: 'flex-start',
        fontSize: '11px',
        fontWeight: 800,
        padding: '3px 10px',
        borderRadius: '9999px',
        backgroundColor: out ? '#FEF2F2' : '#FFF7ED',
        color: out ? '#B91C1C' : '#9A3412',
      }}
    >
      {out ? 'Out of stock' : `Only ${stock} left`}
    </span>
  );
};

/** Same category, in stock, not the product itself. Tapping one swaps the open product. */
export const SimilarProducts: React.FC<{ product: Product; all: Product[]; onOpen: (p: Product) => void }> = ({ product, all, onOpen }) => {
  const similar = all
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId && p.stock > 0)
    .sort((a, b) => Math.abs(a.price - product.price) - Math.abs(b.price - product.price))
    .slice(0, 8);
  if (similar.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <span style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B' }}>You may also like</span>
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '4px' }}>
        {similar.map((p) => (
          <button
            key={p.id}
            onClick={() => onOpen(p)}
            style={{
              flex: '0 0 112px',
              textAlign: 'left',
              padding: '8px',
              borderRadius: '14px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
            }}
          >
            <img
              src={p.images?.[0]}
              alt=""
              loading="lazy"
              style={{ width: '100%', height: '76px', objectFit: 'cover', borderRadius: '10px', backgroundColor: '#F1F5F9' }}
            />
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#1E293B', marginTop: '6px', lineHeight: 1.25, height: '28px', overflow: 'hidden' }}>
              {p.name}
            </div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#2C7372' }}>₹{p.price.toLocaleString('en-IN')}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
