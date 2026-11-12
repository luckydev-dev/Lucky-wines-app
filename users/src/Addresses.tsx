import React from 'react';
import { deleteMyAddress, type Address } from '@lucky/shared';

interface Props {
  addresses: Address[];
  selectedId: string | null;
  onPick: (address: Address) => void;
  onDeleted: (id: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

/** Saved delivery addresses (kept in the database under this device's customer id). Tap one to fill the form. */
export const SavedAddresses: React.FC<Props> = ({ addresses, selectedId, onPick, onDeleted, showToast }) => {
  if (addresses.length === 0) return null;

  const remove = async (a: Address) => {
    if (!window.confirm(`Remove saved address "${a.label}"?`)) return;
    try {
      await deleteMyAddress(a.id);
      onDeleted(a.id);
      showToast('Address removed', 'success');
    } catch {
      showToast('Could not remove the address. Try again.', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>Saved addresses</span>
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '2px' }}>
        {addresses.map((a) => {
          const on = a.id === selectedId;
          return (
            <div
              key={a.id}
              style={{
                flex: '0 0 auto',
                maxWidth: '230px',
                display: 'flex',
                alignItems: 'stretch',
                borderRadius: '14px',
                border: `1.5px solid ${on ? '#4AB7B6' : '#E2E8F0'}`,
                backgroundColor: on ? '#E8F5F5' : '#FFFFFF',
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => onPick(a)}
                aria-pressed={on}
                style={{ background: 'none', border: 'none', textAlign: 'left', padding: '8px 10px', cursor: 'pointer', minWidth: 0 }}
              >
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#1E293B' }}>{a.label || 'Address'}</div>
                <div style={{ fontSize: '11px', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {a.line1}, {a.pincode}
                </div>
              </button>
              <button
                onClick={() => remove(a)}
                aria-label={`Remove ${a.label}`}
                style={{ background: 'none', border: 'none', borderLeft: '1px solid #E2E8F0', padding: '0 10px', color: '#94A3B8', cursor: 'pointer', fontSize: '14px' }}
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
