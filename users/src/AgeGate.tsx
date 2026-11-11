import React, { useState } from 'react';
import { AnimatedBottle } from '@lucky/shared';

const STORAGE_KEY = 'lucky_age_confirmed_v1';

export function readAgeConfirmed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'yes';
  } catch {
    return false;
  }
}

function saveAgeConfirmed() {
  try {
    localStorage.setItem(STORAGE_KEY, 'yes');
  } catch {
    /* storage unavailable - the gate simply shows again next launch */
  }
}

/** Shown once on first launch. The legal minimum age text comes from the store settings. */
export default function AgeGate({ notice, onConfirm }: { notice: string; onConfirm: () => void }) {
  const [denied, setDenied] = useState(false);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      style={{
        minHeight: '100vh',
        backgroundColor: '#F4F9F9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '360px',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '28px 24px',
          border: '1px solid #E8F2F2',
          boxShadow: '0 8px 28px rgba(74, 183, 182, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          textAlign: 'center',
        }}
      >
        <AnimatedBottle size={44} color="#4AB7B6" glow />
        <h1 id="age-gate-title" style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#1E293B', fontFamily: "'Poppins', sans-serif" }}>
          {denied ? 'Sorry, we can’t serve you' : 'Are you of legal drinking age?'}
        </h1>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>
          {denied
            ? 'You must be of legal drinking age to browse or buy alcohol from this store.'
            : notice}
        </p>
        {!denied && (
          <>
            <button
              type="button"
              onClick={() => {
                saveAgeConfirmed();
                onConfirm();
              }}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: '#4AB7B6',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Yes, I am of legal age
            </button>
            <button
              type="button"
              onClick={() => setDenied(true)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#475569',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              No, I am not
            </button>
            <p style={{ margin: 0, fontSize: '11px', color: '#94A3B8' }}>
              Please drink responsibly. Never drink and drive.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
