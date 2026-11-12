import React, { useEffect, useState } from 'react';
import {
  Banner,
  Category,
  subscribeToBanners,
  saveBannerInRTDB,
  deleteBannerFromRTDB,
  BottomSheet,
  IconPlus,
  IconEdit,
  IconDelete,
  IconCheck,
  IconClose,
} from '@lucky/shared';

type Toast = (m: string, t?: 'success' | 'error' | 'warning' | 'info') => void;

const card: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '18px',
  padding: '18px',
  border: '1px solid #E8F2F2',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '10px',
  border: '1px solid #CBD5E1',
  fontSize: '13px',
  boxSizing: 'border-box',
  fontFamily: "'DM Sans', sans-serif",
  backgroundColor: '#FFFFFF',
};

export const BannersManager: React.FC<{
  categories: { id: string; name: string }[];
  showToast: Toast;
}> = ({ categories, showToast }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formTarget, setFormTarget] = useState('all');
  const [formActive, setFormActive] = useState(true);
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');

  useEffect(() => {
    const unsub = subscribeToBanners((list) => {
      setBanners(list);
    });
    return () => unsub();
  }, []);

  const openNew = () => {
    const nextOrder = banners.reduce((max, b) => Math.max(max, b.order || 0), 0) + 1;
    setEditingBanner(null);
    setFormTitle('New Special');
    setFormSubtitle('20% OFF');
    setFormImage('https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800');
    setFormTarget('all');
    setFormActive(true);
    setFormStartDate('');
    setFormEndDate('');
    setIsModalOpen(true);
  };

  const openEdit = (b: Banner) => {
    setEditingBanner(b);
    setFormTitle(b.title || '');
    setFormSubtitle(b.subtitle || '');
    setFormImage(b.image || '');
    setFormTarget(b.target || 'all');
    setFormActive(b.active ?? true);
    setFormStartDate(b.startDate || '');
    setFormEndDate(b.endDate || '');
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formImage.trim()) {
      showToast('Banner image URL is required', 'warning');
      return;
    }
    setBusy(true);
    try {
      const bannerId = editingBanner?.id || `b_${Date.now()}`;
      const nextOrder = editingBanner ? editingBanner.order : (banners.reduce((max, b) => Math.max(max, b.order || 0), 0) + 1);

      const bannerData: Banner = {
        id: bannerId,
        title: formTitle.trim(),
        subtitle: formSubtitle.trim(),
        image: formImage.trim(),
        target: formTarget,
        order: nextOrder,
        active: formActive,
        startDate: formStartDate || undefined,
        endDate: formEndDate || undefined,
      };

      await saveBannerInRTDB(bannerData);
      showToast(editingBanner ? 'Banner updated!' : 'New banner added!', 'success');
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save banner:', err);
      showToast('Could not save banner. Check your connection.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (b: Banner) => {
    if (!confirm(`Delete banner "${b.title || b.id}"?`)) return;
    try {
      await deleteBannerFromRTDB(b.id);
      showToast('Banner deleted', 'info');
    } catch (err) {
      console.error('Failed to delete banner:', err);
      showToast('Could not delete banner', 'error');
    }
  };

  const handleToggleActive = async (b: Banner) => {
    try {
      await saveBannerInRTDB({ ...b, active: !b.active });
      showToast(b.active ? 'Banner deactivated' : 'Banner activated', 'success');
    } catch {
      showToast('Could not update banner status', 'error');
    }
  };

  const handleMove = async (index: number, dir: -1 | 1) => {
    const targetIdx = index + dir;
    if (targetIdx < 0 || targetIdx >= banners.length) return;
    const current = banners[index];
    const target = banners[targetIdx];
    try {
      await Promise.all([
        saveBannerInRTDB({ ...current, order: target.order }),
        saveBannerInRTDB({ ...target, order: current.order }),
      ]);
    } catch {
      showToast('Could not reorder banners', 'error');
    }
  };

  return (
    <div style={card}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '15px', fontWeight: 800, color: '#15080C', fontFamily: "'Poppins', sans-serif" }}>
            Promo Banners Carousel ({banners.length})
          </span>
          <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#6A565C' }}>
            Auto-scrolls on customer home screen in order
          </p>
        </div>
        <button
          onClick={openNew}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#720D2B',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            padding: '7px 12px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <IconPlus size={14} /> Add Banner
        </button>
      </div>

      {banners.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#9E868E', fontSize: '13px' }}>
          No promotional banners yet. Add one to feature deals on the home screen.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {banners.map((b, idx) => (
            <div
              key={b.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px',
                borderRadius: '14px',
                backgroundColor: b.active ? '#FDFBF9' : '#F1ECE8',
                border: b.active ? '1.5px solid #EFE7E1' : '1px dashed #CBD5E1',
                opacity: b.active ? 1 : 0.7,
              }}
            >
              {/* Thumbnail */}
              <div
                style={{
                  width: '64px',
                  height: '48px',
                  borderRadius: '10px',
                  backgroundImage: `url(${b.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: '#E2ECEC',
                  flexShrink: 0,
                }}
              />

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#15080C' }}>
                    {b.title || 'Untitled Banner'}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '6px',
                      backgroundColor: b.active ? '#DCFCE7' : '#F3F4F6',
                      color: b.active ? '#15803D' : '#6B7280',
                    }}
                  >
                    {b.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#6A565C', marginTop: '2px' }}>
                  {b.subtitle ? `${b.subtitle} • ` : ''}Target: {b.target === 'all' ? 'All Products' : b.target}
                  {b.startDate || b.endDate ? ` • ${b.startDate || 'Now'} to ${b.endDate || 'No end'}` : ''}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button
                  onClick={() => handleMove(idx, -1)}
                  disabled={idx === 0}
                  title="Move Up"
                  style={{
                    background: 'none',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '4px 7px',
                    cursor: idx === 0 ? 'default' : 'pointer',
                    opacity: idx === 0 ? 0.3 : 1,
                    fontSize: '11px',
                  }}
                >
                  ↑
                </button>
                <button
                  onClick={() => handleMove(idx, 1)}
                  disabled={idx === banners.length - 1}
                  title="Move Down"
                  style={{
                    background: 'none',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '4px 7px',
                    cursor: idx === banners.length - 1 ? 'default' : 'pointer',
                    opacity: idx === banners.length - 1 ? 0.3 : 1,
                    fontSize: '11px',
                  }}
                >
                  ↓
                </button>
                <button
                  onClick={() => handleToggleActive(b)}
                  title={b.active ? 'Pause Banner' : 'Activate Banner'}
                  style={{
                    background: 'none',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '4px 7px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    color: b.active ? '#D97706' : '#15803D',
                    fontWeight: 700,
                  }}
                >
                  {b.active ? 'Pause' : 'Enable'}
                </button>
                <button
                  onClick={() => openEdit(b)}
                  title="Edit Banner"
                  style={{
                    background: 'none',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '6px',
                    cursor: 'pointer',
                    color: '#720D2B',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <IconEdit size={14} />
                </button>
                <button
                  onClick={() => handleDelete(b)}
                  title="Delete Banner"
                  style={{
                    background: 'none',
                    border: '1px solid #FCA5A5',
                    borderRadius: '8px',
                    padding: '6px',
                    cursor: 'pointer',
                    color: '#DC2626',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <IconDelete size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Add Modal */}
      <BottomSheet
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBanner ? 'Edit Promo Banner' : 'Add Promo Banner'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#6A565C', display: 'block', marginBottom: '4px' }}>
              Banner Title
            </label>
            <input
              type="text"
              placeholder="e.g. Happy Weekend / Diwali Cheers"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#6A565C', display: 'block', marginBottom: '4px' }}>
                Discount / Highlight Tag
              </label>
              <input
                type="text"
                placeholder="e.g. 25% OFF / Buy 2 Get 1"
                value={formSubtitle}
                onChange={(e) => setFormSubtitle(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#6A565C', display: 'block', marginBottom: '4px' }}>
                Target Category
              </label>
              <select
                value={formTarget}
                onChange={(e) => setFormTarget(e.target.value)}
                style={inputStyle}
              >
                <option value="all">All Products</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#6A565C', display: 'block', marginBottom: '4px' }}>
              Image URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formImage}
              onChange={(e) => setFormImage(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Date range */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#6A565C', display: 'block', marginBottom: '4px' }}>
                Start Date (Optional)
              </label>
              <input
                type="date"
                value={formStartDate}
                onChange={(e) => setFormStartDate(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#6A565C', display: 'block', marginBottom: '4px' }}>
                End Date (Optional)
              </label>
              <input
                type="date"
                value={formEndDate}
                onChange={(e) => setFormEndDate(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Active Switch */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '4px' }}>
            <input
              type="checkbox"
              checked={formActive}
              onChange={(e) => setFormActive(e.target.checked)}
            />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#15080C' }}>
              Active (Visible on customer app)
            </span>
          </label>

          <button
            onClick={handleSave}
            disabled={busy}
            style={{
              marginTop: '8px',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#720D2B',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 800,
              cursor: busy ? 'default' : 'pointer',
              opacity: busy ? 0.7 : 1,
              boxShadow: '0 4px 14px rgba(114, 13, 43, 0.3)',
            }}
          >
            {busy ? 'Saving...' : editingBanner ? 'Save Changes' : 'Create Banner'}
          </button>
        </div>
      </BottomSheet>
    </div>
  );
};
