import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  Order,
  StoreSettings,
  upiLink,
  gpayLink,
  phonePeLink,
  paytmLink,
  submitUpiPaymentInRTDB,
  useToast,
  IconUPI,
  IconCopy,
} from '@lucky/shared';

const PAY_WINDOW_MS = 10 * 60 * 1000;

const card: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  padding: '16px',
  border: '1px solid #E8F2F2',
  boxShadow: '0 2px 10px rgba(74, 183, 182, 0.08)',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const appButton: React.CSSProperties = {
  flex: '1 1 45%',
  textAlign: 'center',
  padding: '10px 8px',
  borderRadius: '10px',
  border: '1.5px solid #4AB7B6',
  backgroundColor: '#F0FBFB',
  color: '#2C7372',
  fontSize: '12px',
  fontWeight: 800,
  textDecoration: 'none',
};

const smallButton: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  flex: 1,
  padding: '8px',
  borderRadius: '10px',
  border: '1px solid #CBD5E1',
  backgroundColor: '#FFFFFF',
  color: '#334155',
  fontSize: '12px',
  fontWeight: 700,
  cursor: 'pointer',
};

function copyText(text: string, ok: string, showToast: (m: string, t?: 'success' | 'error' | 'warning' | 'info') => void) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(
      () => showToast(ok, 'success'),
      () => showToast('Could not copy. Long-press the text to copy it.', 'warning')
    );
  } else {
    showToast('Copy is not available on this device.', 'warning');
  }
}

/**
 * Shown in the order sheet for UPI orders. The order already exists (awaiting_verification),
 * so nothing is lost if the UPI app is opened and this app is killed in the background.
 * A UPI link cannot confirm payment automatically - the store owner verifies the UTR.
 */
export default function UpiPaymentPanel({ order, settings }: { order: Order; settings: StoreSettings }) {
  const { showToast } = useToast();
  const [qr, setQr] = useState('');
  const [now, setNow] = useState(() => Date.now());
  const [utr, setUtr] = useState('');
  const [busy, setBusy] = useState(false);

  const input = {
    upiId: settings.upiId,
    payeeName: settings.upiPayeeName || settings.shopName,
    amount: order.total,
    orderId: order.id,
  };
  const link = upiLink(input);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(link, { width: 240, margin: 1, errorCorrectionLevel: 'M' })
      .then((url) => {
        if (!cancelled) setQr(url);
      })
      .catch(() => {
        if (!cancelled) setQr('');
      });
    return () => {
      cancelled = true;
    };
  }, [link]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (order.paymentMethod !== 'upi') return null;

  if (order.paymentStatus === 'paid') {
    return (
      <div style={{ ...card, borderColor: '#BBF7D0', backgroundColor: '#F0FDF4' }}>
        <strong style={{ fontSize: '13px', color: '#166534' }}>Payment received ✓</strong>
      </div>
    );
  }
  if (order.paymentStatus === 'payment_submitted') {
    return (
      <div style={{ ...card, borderColor: '#FDE68A', backgroundColor: '#FFFBEB' }}>
        <strong style={{ fontSize: '13px', color: '#92400E' }}>Payment submitted - waiting for the store to verify</strong>
        <span style={{ fontSize: '12px', color: '#92400E' }}>UTR: {order.utr}</span>
      </div>
    );
  }
  if (order.paymentStatus === 'failed') {
    return (
      <div style={{ ...card, borderColor: '#FECACA', backgroundColor: '#FEF2F2' }}>
        <strong style={{ fontSize: '13px', color: '#B91C1C' }}>The store could not verify this payment</strong>
        <span style={{ fontSize: '12px', color: '#B91C1C' }}>
          Please call the store{settings.phone ? ` on ${settings.phone}` : ''}.
        </span>
      </div>
    );
  }
  if (order.paymentStatus !== 'awaiting_verification') return null;

  const remaining = Math.max(0, order.createdAt + PAY_WINDOW_MS - now);
  const mm = String(Math.floor(remaining / 60000)).padStart(2, '0');
  const ss = String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0');

  const submit = async () => {
    const value = utr.trim();
    if (!/^[0-9]{12}$/.test(value)) {
      showToast('Enter the 12-digit UTR / reference number from your UPI app', 'warning');
      return;
    }
    setBusy(true);
    try {
      await submitUpiPaymentInRTDB(order.id, value);
      showToast('Payment submitted. The store will verify it shortly.', 'success');
    } catch (err) {
      console.error('Submitting UPI payment failed:', err);
      showToast('Could not submit your payment. Check your connection and try again.', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={card}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconUPI size={20} color="#4AB7B6" />
          <strong style={{ fontSize: '14px', color: '#1E293B' }}>
            Pay ₹{order.total.toLocaleString('en-IN')} by UPI
          </strong>
        </div>
        <span style={{ fontSize: '12px', fontWeight: 800, color: remaining > 0 ? '#2C7372' : '#B45309' }}>
          {remaining > 0 ? `${mm}:${ss}` : 'Time up'}
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <a href={gpayLink(input)} style={appButton}>Google Pay</a>
        <a href={phonePeLink(input)} style={appButton}>PhonePe</a>
        <a href={paytmLink(input)} style={appButton}>Paytm</a>
        <a href={link} style={appButton}>Other UPI app</a>
      </div>

      <div style={{ fontSize: '11px', color: '#64748B', textAlign: 'center' }}>
        No app opened? Scan this QR with another phone, or copy the UPI ID below.
      </div>

      {qr && (
        <img
          src={qr}
          alt={`UPI QR code for ₹${order.total}`}
          width={200}
          height={200}
          style={{ alignSelf: 'center', borderRadius: '12px', border: '1px solid #E2E8F0' }}
        />
      )}

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          type="button"
          style={smallButton}
          onClick={() => copyText(settings.upiId, `UPI ID copied: ${settings.upiId}`, showToast)}
        >
          <IconCopy size={14} color="#334155" />
          <span>{settings.upiId}</span>
        </button>
        <button
          type="button"
          style={smallButton}
          onClick={() => copyText(link, 'Payment link copied', showToast)}
        >
          <IconCopy size={14} color="#334155" />
          <span>Copy link</span>
        </button>
      </div>

      <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
          After paying, enter the 12-digit UTR / reference number:
        </span>
        <input
          type="text"
          inputMode="numeric"
          maxLength={12}
          placeholder="12-digit UTR"
          value={utr}
          onChange={(e) => setUtr(e.target.value.replace(/[^0-9]/g, ''))}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '10px',
            border: '1px solid #CBD5E1',
            fontSize: '14px',
            fontFamily: 'monospace',
            color: '#1E293B',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        <button
          type="button"
          onClick={submit}
          disabled={busy}
          style={{
            padding: '12px',
            borderRadius: '12px',
            border: 'none',
            backgroundColor: '#4AB7B6',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 700,
            cursor: busy ? 'default' : 'pointer',
            opacity: busy ? 0.7 : 1,
          }}
        >
          {busy ? 'Submitting…' : 'I have paid'}
        </button>
        <span style={{ fontSize: '10px', color: '#94A3B8', textAlign: 'center' }}>
          The store confirms your payment manually - it is not verified automatically.
        </span>
      </div>
    </div>
  );
}
