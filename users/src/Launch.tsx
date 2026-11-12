import React, { useEffect, useState } from 'react';
import { AnimatedBottle, DEFAULT_SETTINGS, subscribeToStoreSettings } from '@lucky/shared';

const AGE_KEY = 'lucky_age_confirmed_v1';

const readConfirmed = (): boolean => {
  try {
    return localStorage.getItem(AGE_KEY) === 'yes';
  } catch {
    return false;
  }
};

const rememberConfirmed = () => {
  try {
    localStorage.setItem(AGE_KEY, 'yes');
  } catch {
    /* storage can be unavailable - the gate simply shows again next launch */
  }
};

const overlay: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 20000,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  boxSizing: 'border-box',
  backgroundColor: '#FFFFFF',
};

/** Animated-logo splash, then a first-launch legal-age confirmation. The answer is remembered on the device. */
export const LaunchGate: React.FC = () => {
  const [splash, setSplash] = useState(true);
  const [confirmed, setConfirmed] = useState(readConfirmed);
  const [declined, setDeclined] = useState(false);
  const [notice, setNotice] = useState(DEFAULT_SETTINGS.minAgeNotice);

  useEffect(() => {
    const t = window.setTimeout(() => setSplash(false), 1400);
    return () => window.clearTimeout(t);
  }, []);

  // The shop owner can change this wording in the admin app to match local law
  useEffect(() => {
    const unsub = subscribeToStoreSettings((s) => {
      if (s?.minAgeNotice) setNotice(s.minAgeNotice);
    });
    return () => unsub();
  }, []);

  if (splash) {
    return (
      <div style={{ ...overlay, backgroundColor: '#15080C' }} role="status" aria-label="Loading Lucky Wine">
        <AnimatedBottle size={72} color="#D4AF37" glow />
        <div style={{ marginTop: '16px', fontSize: '26px', fontWeight: 800, color: '#D4AF37', fontFamily: "'Poppins', sans-serif", letterSpacing: '0.5px' }}>
          Lucky<span style={{ color: '#E5C454' }}>Wine</span>
        </div>
        <div style={{ marginTop: '6px', fontSize: '11px', fontWeight: 600, color: '#A82C48', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Premium Cellar & Spirits
        </div>
      </div>
    );
  }

  if (confirmed) return null;

  if (declined) {
    return (
      <div style={{ ...overlay, backgroundColor: '#FDFBF9' }}>
        <div style={{ maxWidth: '320px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#15080C', margin: '0 0 8px' }}>Sorry, we cannot let you in</h1>
          <p style={{ fontSize: '13px', color: '#6A565C', lineHeight: 1.5, margin: '0 0 16px' }}>
            Alcohol can only be sold to people of legal drinking age. Please come back when you are old enough.
          </p>
          <button
            onClick={() => setDeclined(false)}
            style={{ background: 'none', border: 'none', color: '#720D2B', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...overlay, backgroundColor: '#FDFBF9' }} role="dialog" aria-modal="true" aria-labelledby="age-title">
      <div style={{ maxWidth: '340px', width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <AnimatedBottle size={48} color="#720D2B" glow />
        </div>
        <h1 id="age-title" style={{ fontSize: '22px', fontWeight: 800, color: '#15080C', margin: 0 }}>
          Are you of legal drinking age?
        </h1>
        <p style={{ fontSize: '13px', color: '#4D3B40', lineHeight: 1.5, margin: 0 }}>{notice}</p>
        <button
          onClick={() => {
            rememberConfirmed();
            setConfirmed(true);
          }}
          style={{
            padding: '14px',
            borderRadius: '14px',
            border: 'none',
            backgroundColor: '#720D2B',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(114, 13, 43, 0.25)',
          }}
        >
          Yes, I am of legal age
        </button>
        <button
          onClick={() => setDeclined(true)}
          style={{
            padding: '12px',
            borderRadius: '14px',
            border: '1.5px solid #EFE7E1',
            backgroundColor: '#FFFFFF',
            color: '#6A565C',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          No
        </button>
        <p style={{ fontSize: '11px', color: '#9E868E', lineHeight: 1.5, margin: 0 }}>
          Please drink responsibly. Never drink and drive. Government photo ID may be checked on delivery.
        </p>
      </div>
    </div>
  );
};

/** Slim banner shown while the phone has no internet connection. */
export const OfflineBanner: React.FC = () => {
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));

  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => {
      window.removeEventListener('online', up);
      window.removeEventListener('offline', down);
    };
  }, []);

  if (online) return null;
  return (
    <div
      role="status"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 19999,
        padding: 'max(env(safe-area-inset-top, 0px), 6px) 12px 6px',
        backgroundColor: '#1E293B',
        color: '#FFFFFF',
        fontSize: '12px',
        fontWeight: 700,
        textAlign: 'center',
      }}
    >
      You are offline. Showing saved items - orders need internet.
    </div>
  );
};
