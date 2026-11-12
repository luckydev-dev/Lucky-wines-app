import React from 'react';
import type { Product } from '@lucky/shared';

export type SortOption = 'popular' | 'newest' | 'price_asc' | 'price_desc' | 'abv';

export interface CatalogFilters {
  sort: SortOption;
  brand: string; // 'all' or a brand name
  size: string; // 'all' or ml as text
  maxPrice: string; // 'all' or rupees as text
}

export const DEFAULT_FILTERS: CatalogFilters = { sort: 'popular', brand: 'all', size: 'all', maxPrice: 'all' };

const PRICE_STEPS = [500, 1000, 2000, 5000];

export const applyFilters = (products: Product[], f: CatalogFilters): Product[] => {
  const list = products.filter(
    (p) =>
      (f.brand === 'all' || p.brand === f.brand) &&
      (f.size === 'all' || String(p.sizeMl) === f.size) &&
      (f.maxPrice === 'all' || p.price <= Number(f.maxPrice))
  );
  return list.sort((a, b) => {
    if (f.sort === 'price_asc') return a.price - b.price;
    if (f.sort === 'price_desc') return b.price - a.price;
    if (f.sort === 'abv') return (b.abv || 0) - (a.abv || 0);
    if (f.sort === 'newest') return (b.createdAt || 0) - (a.createdAt || 0);
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });
};

const select: React.CSSProperties = {
  flex: '0 0 auto',
  padding: '8px 10px',
  borderRadius: '12px',
  border: '1px solid #E2ECEC',
  backgroundColor: '#FFFFFF',
  color: '#334155',
  fontSize: '12px',
  fontWeight: 600,
  maxWidth: '150px',
};

/** Sort + brand / size / price filters. Options are built from the live catalog. */
export const FilterBar: React.FC<{
  products: Product[];
  filters: CatalogFilters;
  onChange: (f: CatalogFilters) => void;
}> = ({ products, filters, onChange }) => {
  const brands = Array.from(new Set(products.map((p) => p.brand).filter(Boolean))).sort();
  const sizes = Array.from(new Set(products.map((p) => p.sizeMl))).sort((a, b) => a - b);
  const set = (patch: Partial<CatalogFilters>) => onChange({ ...filters, ...patch });
  const dirty = filters.brand !== 'all' || filters.size !== 'all' || filters.maxPrice !== 'all' || filters.sort !== 'popular';

  return (
    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '2px' }}>
      <select aria-label="Sort by" style={select} value={filters.sort} onChange={(e) => set({ sort: e.target.value as SortOption })}>
        <option value="popular">Popular</option>
        <option value="newest">Newest</option>
        <option value="price_asc">Price: low to high</option>
        <option value="price_desc">Price: high to low</option>
        <option value="abv">Strongest first</option>
      </select>
      <select aria-label="Brand" style={select} value={filters.brand} onChange={(e) => set({ brand: e.target.value })}>
        <option value="all">All brands</option>
        {brands.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>
      <select aria-label="Bottle size" style={select} value={filters.size} onChange={(e) => set({ size: e.target.value })}>
        <option value="all">Any size</option>
        {sizes.map((s) => (
          <option key={s} value={String(s)}>
            {s} ml
          </option>
        ))}
      </select>
      <select aria-label="Maximum price" style={select} value={filters.maxPrice} onChange={(e) => set({ maxPrice: e.target.value })}>
        <option value="all">Any price</option>
        {PRICE_STEPS.map((p) => (
          <option key={p} value={String(p)}>
            Up to ₹{p.toLocaleString('en-IN')}
          </option>
        ))}
      </select>
      {dirty && (
        <button
          onClick={() => onChange(DEFAULT_FILTERS)}
          style={{ ...select, border: 'none', backgroundColor: '#E8F5F5', color: '#2C7372', fontWeight: 800, cursor: 'pointer' }}
        >
          Reset
        </button>
      )}
    </div>
  );
};
