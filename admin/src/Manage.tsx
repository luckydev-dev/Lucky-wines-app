import React, { useEffect, useMemo, useState } from 'react';
import {
  bulkUpdateProducts,
  deleteBannerFromRTDB,
  saveBannerInRTDB,
  subscribeToBanners,
  deleteCategoryFromRTDB,
  saveCategoryInRTDB,
  subscribeToCategories,
  type Banner,
  type Category,
  type Order,
  type Product,
} from '@lucky/shared';

type Toast = (m: string, t?: 'success' | 'error' | 'warning' | 'info') => void;

const card: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '18px',
  padding: '18px',
  border: '1px solid #E8F2F2',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const input: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  padding: '9px 10px',
  borderRadius: '10px',
  border: '1px solid #CBD5E1',
  fontSize: '13px',
  boxSizing: 'border-box',
};

const smallBtn = (color: string): React.CSSProperties => ({
  background: 'none',
  border: `1.5px solid ${color}`,
  color,
  borderRadius: '9999px',
  padding: '5px 10px',
  fontSize: '11px',
  fontWeight: 700,
  cursor: 'pointer',
  flexShrink: 0,
});

const slug = (name: string) =>
  'cat_' +
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 30);

/** Lets the owner rename, hide, reorder, add and delete the categories the customer app shows. */
export const CategoriesManager: React.FC<{ productCountByCategory: Record<string, number>; showToast: Toast }> = ({
  productCountByCategory,
  showToast,
}) => {
  const [cats, setCats] = useState<Category[]>([]);
  const [newName, setNewName] = useState('');
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  useEffect(() => subscribeToCategories(setCats), []);

  const save = async (c: Category, label = 'Saved') => {
    try {
      await saveCategoryInRTDB(c);
      showToast(label, 'success');
    } catch {
      showToast('Could not save. Check your connection and admin access.', 'error');
    }
  };

  const add = async () => {
    const name = newName.trim();
    if (!name) return;
    const id = slug(name);
    if (id === 'cat_' || cats.some((c) => c.id === id)) {
      showToast('A category with this name already exists', 'warning');
      return;
    }
    const order = cats.reduce((m, c) => Math.max(m, c.order), 0) + 1;
    await save({ id, name, order, icon: 'whiskey', visible: true }, 'Category added');
    setNewName('');
  };

  const move = async (index: number, dir: -1 | 1) => {
    const other = cats[index + dir];
    const me = cats[index];
    if (!other || !me) return;
    try {
      await Promise.all([
        saveCategoryInRTDB({ ...me, order: other.order }),
        saveCategoryInRTDB({ ...other, order: me.order }),
      ]);
    } catch {
      showToast('Could not reorder', 'error');
    }
  };

  const remove = async (c: Category) => {
    const n = productCountByCategory[c.id] || 0;
    if (n > 0) {
      showToast(`Move or delete the ${n} product${n === 1 ? '' : 's'} in "${c.name}" first`, 'warning');
      return;
    }
    if (!window.confirm(`Delete category "${c.name}"?`)) return;
    try {
      await deleteCategoryFromRTDB(c.id);
      showToast('Category deleted', 'success');
    } catch {
      showToast('Could not delete', 'error');
    }
  };

  return (
    <div style={card}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B' }}>Categories</span>
        <span style={{ fontSize: '11px', color: '#4AB7B6', fontWeight: 700 }}>Updates User App Instantly</span>
      </div>
      {cats.length === 0 && (
        <span style={{ fontSize: '12px', color: '#94A3B8' }}>
          No categories in the database yet. Import firebase/seed-data.json (see SETUP.md) or add one below.
        </span>
      )}
      {cats.map((c, i) => (
        <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <input
            aria-label={`Name of ${c.name}`}
            style={input}
            value={drafts[c.id] ?? c.name}
            maxLength={40}
            onChange={(e) => setDrafts({ ...drafts, [c.id]: e.target.value })}
            onBlur={() => {
              const v = (drafts[c.id] ?? c.name).trim();
              if (v && v !== c.name) void save({ ...c, name: v });
              setDrafts((d) => {
                const { [c.id]: _x, ...rest } = d;
                return rest;
              });
            }}
          />
          <span style={{ fontSize: '11px', color: '#64748B', width: '44px', textAlign: 'center' }}>
            {productCountByCategory[c.id] || 0} items
          </span>
          <button aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} style={smallBtn('#64748B')}>
            ↑
          </button>
          <button aria-label="Move down" disabled={i === cats.length - 1} onClick={() => move(i, 1)} style={smallBtn('#64748B')}>
            ↓
          </button>
          <button
            onClick={() => save({ ...c, visible: !c.visible }, c.visible ? 'Hidden from customers' : 'Visible to customers')}
            style={smallBtn(c.visible ? '#10B981' : '#94A3B8')}
          >
            {c.visible ? 'Shown' : 'Hidden'}
          </button>
          <button onClick={() => remove(c)} style={smallBtn('#B91C1C')}>
            Delete
          </button>
        </div>
      ))}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          style={input}
          placeholder="New category, e.g. Tequila"
          value={newName}
          maxLength={40}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && void add()}
        />
        <button
          onClick={add}
          style={{
            padding: '9px 14px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: '#4AB7B6',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
};

interface CustomerRow {
  key: string;
  name: string;
  phone: string;
  orders: number;
  spent: number;
  last: number;
}

/** Customers are derived from orders (no separate customer database): totals ignore cancelled orders. */
export const CustomersList: React.FC<{ orders: Order[] }> = ({ orders }) => {
  const [q, setQ] = useState('');

  const rows = useMemo(() => {
    const map = new Map<string, CustomerRow>();
    for (const o of orders) {
      const phone = (o.userPhone || '').replace(/\D/g, '').slice(-10);
      const key = phone || o.userId;
      const row = map.get(key) ?? { key, name: o.userName || 'Customer', phone: o.userPhone || '', orders: 0, spent: 0, last: 0 };
      if (o.status !== 'cancelled') {
        row.orders += 1;
        if (o.paymentStatus !== 'failed') row.spent += o.total;
      }
      if (o.createdAt >= row.last) {
        row.last = o.createdAt;
        row.name = o.userName || row.name;
        row.phone = o.userPhone || row.phone;
      }
      map.set(key, row);
    }
    return [...map.values()].filter((r) => r.orders > 0).sort((a, b) => b.spent - a.spent);
  }, [orders]);

  const shown = q.trim()
    ? rows.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()) || r.phone.includes(q.trim()))
    : rows;

  return (
    <div style={card}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B' }}>Customers ({rows.length})</span>
        <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>From orders, cancelled excluded</span>
      </div>
      <input
        style={{ ...input, flex: 'none', width: '100%' }}
        placeholder="Search name or phone"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {shown.length === 0 && <span style={{ fontSize: '12px', color: '#94A3B8' }}>No customers yet.</span>}
      {shown.slice(0, 50).map((r) => (
        <div
          key={r.key}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            padding: '10px 12px',
            borderRadius: '12px',
            backgroundColor: '#F8FAFC',
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>{r.name}</div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              {r.phone} • {r.orders} order{r.orders === 1 ? '' : 's'} • last{' '}
              {new Date(r.last).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B' }}>₹{r.spent.toLocaleString('en-IN')}</span>
            {r.phone && (
              <a href={`tel:${r.phone.replace(/\s/g, '')}`} style={{ ...smallBtn('#4AB7B6'), textDecoration: 'none' }}>
                Call
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

/** Change prices or stock for a whole category (or the whole shop) in one go. */
export const BulkEdit: React.FC<{ products: Product[]; categories: { id: string; name: string }[]; showToast: Toast }> = ({
  products,
  categories,
  showToast,
}) => {
  const [scope, setScope] = useState('all');
  const [mode, setMode] = useState<'pricePct' | 'stockSet' | 'stockAdd'>('pricePct');
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);

  const targets = products.filter((p) => scope === 'all' || p.categoryId === scope);

  const apply = async () => {
    const n = Number(value);
    if (!value.trim() || !Number.isFinite(n)) {
      showToast('Enter a number first', 'warning');
      return;
    }
    if (mode === 'pricePct' && (n <= -90 || n > 200)) {
      showToast('Price change must be between -90% and +200%', 'warning');
      return;
    }
    if (mode === 'stockSet' && (n < 0 || n > 100000)) {
      showToast('Stock must be 0 or more', 'warning');
      return;
    }
    if (targets.length === 0) {
      showToast('No products in this selection', 'warning');
      return;
    }
    const label =
      mode === 'pricePct' ? `change price by ${n}%` : mode === 'stockSet' ? `set stock to ${n}` : `add ${n} to stock`;
    if (!window.confirm(`${label} for ${targets.length} product${targets.length === 1 ? '' : 's'}?`)) return;

    const changes: Record<string, Partial<Product>> = {};
    for (const p of targets) {
      if (mode === 'pricePct') {
        const price = Math.max(1, Math.round(p.price * (1 + n / 100)));
        changes[p.id] = { price, mrp: Math.max(p.mrp, price) };
      } else if (mode === 'stockSet') {
        changes[p.id] = { stock: Math.round(n) };
      } else {
        changes[p.id] = { stock: Math.max(0, p.stock + Math.round(n)) };
      }
    }
    setBusy(true);
    try {
      await bulkUpdateProducts(changes);
      showToast(`Updated ${targets.length} products`, 'success');
      setValue('');
    } catch {
      showToast('Bulk update failed. Nothing was changed.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const sel: React.CSSProperties = { ...input, flex: 'none', backgroundColor: '#FFFFFF' };
  return (
    <div style={card}>
      <span style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B' }}>Bulk price &amp; stock edit</span>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <select aria-label="Which products" style={sel} value={scope} onChange={(e) => setScope(e.target.value)}>
          <option value="all">All products ({products.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select aria-label="What to change" style={sel} value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}>
          <option value="pricePct">Change price by %</option>
          <option value="stockSet">Set stock to</option>
          <option value="stockAdd">Add to stock</option>
        </select>
        <input
          aria-label="Amount"
          style={{ ...input, flex: '1 1 80px' }}
          inputMode="decimal"
          placeholder={mode === 'pricePct' ? 'e.g. 5 or -10' : 'e.g. 20'}
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/[^0-9.\-]/g, ''))}
        />
        <button
          onClick={apply}
          disabled={busy}
          style={{
            padding: '9px 14px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: '#4AB7B6',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: 800,
            cursor: busy ? 'default' : 'pointer',
            opacity: busy ? 0.7 : 1,
          }}
        >
          {busy ? 'Applying…' : 'Apply'}
        </button>
      </div>
      <span style={{ fontSize: '11px', color: '#64748B' }}>
        Prices are rounded to whole rupees. MRP is raised automatically if the new price would be above it.
      </span>
    </div>
  );
};

// ---------------------------------------------------------------- banners

const toLocalInput = (ms?: number) => {
  if (!ms) return '';
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const fromLocalInput = (v: string): number | undefined => {
  if (!v) return undefined;
  const t = new Date(v).getTime();
  return Number.isFinite(t) ? t : undefined;
};

const bannerStatus = (b: Banner, now = Date.now()): { label: string; color: string } => {
  if (!b.active) return { label: 'Off', color: '#94A3B8' };
  if (b.startsAt && b.startsAt > now) return { label: 'Scheduled', color: '#B45309' };
  if (b.endsAt && b.endsAt < now) return { label: 'Expired', color: '#B91C1C' };
  return { label: 'Live', color: '#10B981' };
};

const emptyBanner = (order: number): Banner => ({
  id: `bn_${Date.now().toString(36)}`,
  image: '',
  title: '',
  subtitle: '',
  target: '',
  order,
  active: true,
});

/** Add, edit, reorder, schedule and delete the home-screen banners shown in the customer app. */
export const BannersManager: React.FC<{ categories: { id: string; name: string }[]; showToast: Toast }> = ({
  categories,
  showToast,
}) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [draft, setDraft] = useState<Banner | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(
    () =>
      subscribeToBanners((list) => setBanners([...list].sort((a, b) => a.order - b.order))),
    []
  );

  const save = async () => {
    if (!draft) return;
    if (!draft.image.trim() || !/^https?:\/\//i.test(draft.image.trim())) {
      showToast('Add a picture link that starts with https://', 'warning');
      return;
    }
    if (draft.startsAt && draft.endsAt && draft.endsAt <= draft.startsAt) {
      showToast('The end date must be after the start date', 'warning');
      return;
    }
    setBusy(true);
    try {
      await saveBannerInRTDB({
        ...draft,
        image: draft.image.trim(),
        title: draft.title?.trim() || '',
        subtitle: draft.subtitle?.trim() || '',
      });
      showToast('Banner saved. Customers see it now.', 'success');
      setDraft(null);
    } catch {
      showToast('Could not save the banner. Check your connection and admin access.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (b: Banner) => {
    try {
      await saveBannerInRTDB({ ...b, active: !b.active });
    } catch {
      showToast('Could not update the banner', 'error');
    }
  };

  const move = async (i: number, dir: -1 | 1) => {
    const a = banners[i];
    const b = banners[i + dir];
    if (!a || !b) return;
    try {
      await Promise.all([saveBannerInRTDB({ ...a, order: b.order }), saveBannerInRTDB({ ...b, order: a.order })]);
    } catch {
      showToast('Could not reorder', 'error');
    }
  };

  const remove = async (b: Banner) => {
    if (!window.confirm(`Delete banner "${b.title || 'untitled'}"?`)) return;
    try {
      await deleteBannerFromRTDB(b.id);
      showToast('Banner deleted', 'success');
    } catch {
      showToast('Could not delete the banner', 'error');
    }
  };

  const label: React.CSSProperties = { fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' };
  const full: React.CSSProperties = { ...input, flex: 'none', width: '100%' };

  return (
    <div style={card}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B' }}>Home banners ({banners.length})</span>
        <button
          onClick={() => setDraft(emptyBanner(banners.reduce((m, b) => Math.max(m, b.order), 0) + 1))}
          style={{ ...smallBtn('#4AB7B6'), padding: '6px 12px' }}
        >
          + Add banner
        </button>
      </div>

      {banners.length === 0 && !draft && (
        <span style={{ fontSize: '12px', color: '#94A3B8' }}>No banners yet. Customers see no offers carousel.</span>
      )}

      {banners.map((b, i) => {
        const st = bannerStatus(b);
        return (
          <div
            key={b.id}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '12px', backgroundColor: '#F8FAFC' }}
          >
            <div
              style={{
                width: '64px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#E2E8F0',
                backgroundImage: b.image ? `url(${b.image})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                flexShrink: 0,
              }}
            />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {b.title || 'Untitled'}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: st.color }}>{st.label}</div>
            </div>
            <button aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} style={smallBtn('#64748B')}>
              ↑
            </button>
            <button aria-label="Move down" disabled={i === banners.length - 1} onClick={() => move(i, 1)} style={smallBtn('#64748B')}>
              ↓
            </button>
            <button onClick={() => toggle(b)} style={smallBtn(b.active ? '#10B981' : '#94A3B8')}>
              {b.active ? 'On' : 'Off'}
            </button>
            <button onClick={() => setDraft({ ...b })} style={smallBtn('#4AB7B6')}>
              Edit
            </button>
            <button onClick={() => remove(b)} style={smallBtn('#B91C1C')}>
              ✕
            </button>
          </div>
        );
      })}

      {draft && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '12px', borderRadius: '14px', border: '1.5px solid #4AB7B6' }}>
          <div>
            <label style={label} htmlFor="bn-image">Picture link (https://...)</label>
            <input id="bn-image" style={full} value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} placeholder="https://..." />
          </div>
          {draft.image && /^https?:\/\//i.test(draft.image) && (
            <div
              style={{ height: '90px', borderRadius: '12px', backgroundImage: `url(${draft.image})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#E2E8F0' }}
              role="img"
              aria-label="Banner preview"
            />
          )}
          <div>
            <label style={label} htmlFor="bn-title">Headline</label>
            <input id="bn-title" style={full} maxLength={80} value={draft.title || ''} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Weekend Reserve Collection" />
          </div>
          <div>
            <label style={label} htmlFor="bn-sub">Small text</label>
            <input id="bn-sub" style={full} maxLength={120} value={draft.subtitle || ''} onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })} placeholder="Flat 15% off on single malts" />
          </div>
          <div>
            <label style={label} htmlFor="bn-target">When tapped, open category</label>
            <select id="bn-target" style={{ ...full, backgroundColor: '#FFFFFF' }} value={draft.target} onChange={(e) => setDraft({ ...draft, target: e.target.value })}>
              <option value="">Do nothing</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label style={label} htmlFor="bn-start">Show from (optional)</label>
              <input id="bn-start" type="datetime-local" style={full} value={toLocalInput(draft.startsAt)} onChange={(e) => setDraft({ ...draft, startsAt: fromLocalInput(e.target.value) })} />
            </div>
            <div>
              <label style={label} htmlFor="bn-end">Hide after (optional)</label>
              <input id="bn-end" type="datetime-local" style={full} value={toLocalInput(draft.endsAt)} onChange={(e) => setDraft({ ...draft, endsAt: fromLocalInput(e.target.value) })} />
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
            <input type="checkbox" checked={draft.active} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} />
            Active
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={save}
              disabled={busy}
              style={{ flex: 1, padding: '11px', borderRadius: '12px', border: 'none', backgroundColor: '#4AB7B6', color: '#FFFFFF', fontSize: '13px', fontWeight: 800, cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.7 : 1 }}
            >
              {busy ? 'Saving…' : 'Save banner'}
            </button>
            <button onClick={() => setDraft(null)} style={{ ...smallBtn('#64748B'), padding: '11px 14px' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
