import React, { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import {
  BottomSheet,
  IconCopy,
  IconUPI,
  buildUpiLink,
  isValidUpiId,
  submitUpiPayment,
  UPI_APP_LABELS,
  type Order,
  type StoreSettings,
  type UpiApp,
} from '@lucky/shared';

const PAY_WINDOW_SECONDS = 10 * 60;
const APPS: UpiApp[] = ['gpay', 'phonepe', 'paytm', 'generic'];

interface Props {
  order: Order | null;
  settings: StoreSettings;
  onClose: () => void;
  /** Called after the customer taps "I have paid" and it was saved. */
  onSubmitted: (orderId: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

const formatClock = (total: number) => {
  const m = Math.floor(total / 60).toString().padStart(2, '0');
  const s = (total % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

/**
 * UPI payment screen: deep links into UPI apps + a QR code (generated on the device) + copy UPI ID.
 * A UPI link cannot report success back to the app, so the customer taps "I have paid" and the store
 * owner confirms the payment in the admin app.
 */
export const UpiPaymentSheet: React.FC<Props> = ({ order, settings, onClose, onSubmitted, showToast }) => {
  const [qr, setQr] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(PAY_WINDOW_SECONDS);
  const [confirming, setConfirming] = useState(false);
  const [utr, setUtr] = useState('');
  const [busy, setBusy] = useState(false);

  const vpaOk = isValidUpiId(settings.upiId || '');

  const payParams = useMemo(
    () =>
      order
        ? {
            payeeVpa: settings.upiId || '',
            payeeName: settings.upiPayeeName || settings.shopName || 'Lucky Wine',
            amount: order.total,
            orderId: order.id,
          }
        : null,
    [order, settings.upiId, settings.upiPayeeName, settings.shopName]
  );

  const genericLink = payParams && vpaOk ? buildUpiLink(payParams, 'generic') : '';

  // New order -> fresh timer and a clean confirm step
  useEffect(() => {
    setSecondsLeft(PAY_WINDOW_SECONDS);
    setConfirming(false);
    setUtr('');
  }, [order?.id]);

  // QR is drawn locally from the same upi:// link (no external service)
  useEffect(() => {
    let cancelled = false;
    if (!genericLink) {
      setQr('');
      return;
    }
    QRCode.toDataURL(genericLink, { width: 520, margin: 1, errorCorrectionLevel: 'M' })
      .then((url) => {
        if (!cancelled) setQr(url);
      })
      .catch(() => {
        if (!cancelled) setQr('');
      });
    return () => {
      cancelled = true;
    };
  }, [genericLink]);

  useEffect(() => {
    if (!order) return;
    const timer = window.setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => window.clearInterval(timer);
  }, [order?.id]);

  if (!order || !payParams) return null;

  const openApp = (app: UpiApp) => {
    if (!vpaOk) {
      showToast('The store has not set a valid UPI ID yet. Please choose Cash on Delivery.', 'warning');
      return;
    }
    // Capacitor hands upi:// style links to Android, which opens the chosen UPI app
    window.location.href = buildUpiLink(payParams, app);
    showToast(`Opening ${UPI_APP_LABELS[app]}... If nothing opens, scan the QR or copy the UPI ID.`, 'info');
  };

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(settings.upiId);
      showToast(`UPI ID copied: ${settings.upiId}`, 'success');
    } catch {
      showToast(`UPI ID: ${settings.upiId}`, 'info');
    }
  };

  const shareQr = async () => {
    try {
      if (qr && navigator.share) {
        const blob = await (await fetch(qr)).blob();
        const file = new File([blob], `upi-${order.id}.png`, { type: 'image/png' });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: `Pay Rs ${order.total} - ${order.id}` });
          return;
        }
        await navigator.share({ title: `Pay Rs ${order.total} - ${order.id}`, text: genericLink });
        return;
      }
      await navigator.clipboard.writeText(genericLink);
      showToast('UPI payment link copied', 'success');
    } catch {
      /* user closed the share sheet */
    }
  };

  const confirmPaid = async () => {
    const cleaned = utr.trim();
    if (cleaned && !/^[A-Za-z0-9]{6,30}$/.test(cleaned)) {
      showToast('That reference number does not look right. Leave it empty or check it.', 'warning');
      return;
    }
    setBusy(true);
    try {
      await submitUpiPayment(order.id, cleaned || undefined);
      showToast('Thanks! The store will verify your payment shortly.', 'success');
      onSubmitted(order.id);
    } catch (err) {
      console.error('Submitting UPI payment failed:', err);
      showToast('Could not save this. Check your connection and try again.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const expired = secondsLeft === 0;

  return (
    <BottomSheet isOpen={!!order} onClose={onClose} title="Pay with UPI">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Order #{order.id}</div>
          <div style={{ fontSize: '30px', fontWeight: 800, color: '#1E293B', lineHeight: 1.2 }}>
            ₹{order.total.toLocaleString('en-IN')}
          </div>
          <div
            style={{
              display: 'inline-block',
              marginTop: '4px',
              padding: '3px 10px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: expired ? '#FEF2F2' : '#E8F5F5',
              color: expired ? '#B91C1C' : '#2C7372',
            }}
          >
            {expired ? 'Timer ended - you can still pay' : `Pay within ${formatClock(secondsLeft)}`}
          </div>
        </div>

        {!vpaOk && (
          <div
            role="alert"
            style={{
              backgroundColor: '#FFF7ED',
              border: '1px solid #FED7AA',
              color: '#9A3412',
              borderRadius: '12px',
              padding: '10px 12px',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            The store has not set up a UPI ID yet. Please call the store or order with Cash on Delivery.
          </div>
        )}

        {/* UPI app buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {APPS.map((app) => (
            <button
              key={app}
              onClick={() => openApp(app)}
              disabled={!vpaOk}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '12px 8px',
                borderRadius: '12px',
                border: '1.5px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                color: '#1E293B',
                fontSize: '12px',
                fontWeight: 700,
                cursor: vpaOk ? 'pointer' : 'not-allowed',
                opacity: vpaOk ? 1 : 0.5,
              }}
            >
              <IconUPI size={16} color="#4AB7B6" />
              {UPI_APP_LABELS[app]}
            </button>
          ))}
        </div>

        {/* QR */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            padding: '12px',
            border: '1.5px dashed #4AB7B6',
            borderRadius: '16px',
            backgroundColor: '#F8FAFC',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Or scan with any UPI app</div>
          <div
            style={{
              width: '200px',
              height: '200px',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #E2E8F0',
            }}
          >
            {qr ? (
              <img src={qr} alt={`UPI QR code to pay ${order.total} rupees`} width={184} height={184} />
            ) : (
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>{vpaOk ? 'Preparing QR...' : 'QR unavailable'}</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={copyId}
              disabled={!vpaOk}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#E8F5F5',
                color: '#2C7372',
                border: 'none',
                borderRadius: '10px',
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: vpaOk ? 'pointer' : 'not-allowed',
              }}
            >
              <span>{settings.upiId || 'No UPI ID'}</span>
              <IconCopy size={14} color="#2C7372" />
            </button>
            <button
              onClick={shareQr}
              disabled={!vpaOk}
              style={{
                backgroundColor: '#F1F5F9',
                color: '#334155',
                border: 'none',
                borderRadius: '10px',
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: vpaOk ? 'pointer' : 'not-allowed',
              }}
            >
              Share QR
            </button>
          </div>
        </div>

        {/* Confirm step */}
        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '14px',
              border: 'none',
              backgroundColor: '#4AB7B6',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            I have paid
          </button>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '12px',
              borderRadius: '14px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
            }}
          >
            <label htmlFor="utrInput" style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
              UPI reference / UTR number (optional, helps the store verify faster)
            </label>
            <input
              id="utrInput"
              type="text"
              inputMode="text"
              maxLength={30}
              placeholder="e.g. 412345678901"
              value={utr}
              onChange={(e) => setUtr(e.target.value.replace(/[^A-Za-z0-9]/g, ''))}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '13px',
                color: '#1E293B',
                fontFamily: 'monospace',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <button
              onClick={confirmPaid}
              disabled={busy}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 800,
                cursor: busy ? 'default' : 'pointer',
                opacity: busy ? 0.7 : 1,
              }}
            >
              {busy ? 'Saving...' : 'Confirm payment sent'}
            </button>
          </div>
        )}

        <p style={{ margin: 0, fontSize: '11px', color: '#64748B', lineHeight: 1.5, textAlign: 'center' }}>
          Your order is saved. The store checks its UPI account and confirms your payment before packing - this app
          cannot confirm it automatically. You can come back to this screen from your order.
        </p>

        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748B',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            padding: '6px',
          }}
        >
          Pay later
        </button>
      </div>
    </BottomSheet>
  );
};
