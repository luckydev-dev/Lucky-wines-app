import React, { useEffect, useRef, useState } from 'react';
import {
  BottomSheet,
  adminSignOut,
  subscribeToAdminDevices,
  subscribeToMyDevice,
  removeAdminDevice,
  type AdminDeviceEntry,
  type Order,
} from '@lucky/shared';
import {
  buzz,
  getDeviceId,
  getNotificationPermission,
  isNative,
  listenForNotificationTaps,
  notifyNewOrder,
  playChime,
  registerThisDevice,
  rememberPromptDismissed,
  requestNotificationPermission,
  unregisterThisDevice,
  wasPromptDismissed,
} from './alerts';

interface AlertsProps {
  orders: Order[];
  /** Called when the owner taps the banner or a notification */
  onOpenOrder: (orderId: string) => void;
}

/**
 * Watches the live order list. When an order appears that was not there before it plays a chime,
 * vibrates, shows an in-app banner and (if the app is in the background) a system notification.
 * Also registers this phone in admins/{uid}/devices and asks for notification permission with our own screen first.
 */
export const OrderAlerts: React.FC<AlertsProps> = ({ orders, onOpenOrder }) => {
  const knownIds = useRef<Set<string> | null>(null);
  const [banner, setBanner] = useState<Order | null>(null);
  const [askPermission, setAskPermission] = useState(false);
  const openRef = useRef(onOpenOrder);
  openRef.current = onOpenOrder;

  // Register this device and decide whether to show the permission explainer
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const perm = await getNotificationPermission();
        if (cancelled) return;
        if (perm === 'granted') {
          await registerThisDevice();
        } else {
          // Still list the phone; push token is added once permission is granted
          await registerThisDevice().catch(() => undefined);
          if (perm === 'prompt' && !wasPromptDismissed()) setAskPermission(true);
        }
      } catch (e) {
        console.warn('Device registration failed:', e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // If the owner removes this phone from "My devices" (on another phone) sign out here too
  useEffect(() => {
    let registeredOnce = false;
    const unsub = subscribeToMyDevice(getDeviceId(), (exists) => {
      if (exists) {
        registeredOnce = true;
      } else if (registeredOnce) {
        // Only trigger sign out if this device actually existed and was explicitly deleted
        void adminSignOut();
      }
    });
    return () => {
      unsub();
    };
  }, []);

  // Tap on a notification opens that order
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let disposed = false;
    listenForNotificationTaps((id) => openRef.current(id)).then((fn) => {
      if (disposed) fn();
      else cleanup = fn;
    });
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  // New-order detection. The first snapshot is only the baseline so old orders never ring.
  useEffect(() => {
    if (knownIds.current === null) {
      if (orders.length > 0) knownIds.current = new Set(orders.map((o) => o.id));
      else {
        // empty list could be "still loading" - wait for the first non-empty or a short delay
        const t = window.setTimeout(() => {
          if (knownIds.current === null) knownIds.current = new Set();
        }, 2500);
        return () => window.clearTimeout(t);
      }
      return;
    }
    const known = knownIds.current;
    const fresh = orders.filter((o) => !known.has(o.id));
    if (fresh.length === 0) return;
    fresh.forEach((o) => known.add(o.id));
    const newest = fresh.find((o) => o.status === 'placed') ?? null;
    if (!newest) return;
    playChime();
    void buzz();
    setBanner(newest);
    if (document.hidden) void notifyNewOrder(newest);
  }, [orders]);

  useEffect(() => {
    if (!banner) return;
    const t = window.setTimeout(() => setBanner(null), 9000);
    return () => window.clearTimeout(t);
  }, [banner]);

  const enable = async () => {
    setAskPermission(false);
    rememberPromptDismissed();
    const ok = await requestNotificationPermission();
    if (ok) await registerThisDevice().catch(() => undefined);
  };

  return (
    <>
      {banner && (
        <button
          onClick={() => {
            onOpenOrder(banner.id);
            setBanner(null);
          }}
          role="alert"
          style={{
            position: 'fixed',
            top: 'max(env(safe-area-inset-top, 0px), 10px)',
            left: '12px',
            right: '12px',
            zIndex: 15000,
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            textAlign: 'left',
            padding: '12px 14px',
            borderRadius: '16px',
            border: 'none',
            backgroundColor: '#1E293B',
            color: '#FFFFFF',
            boxShadow: '0 10px 30px rgba(15,23,42,0.35)',
            cursor: 'pointer',
            animation: 'luckySlideDown 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 800 }}>New order #{banner.id}</span>
          <span style={{ fontSize: '12px', color: '#CBD5E1' }}>
            {banner.userName || 'Customer'} • ₹{banner.total.toLocaleString('en-IN')} •{' '}
            {banner.paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI'} — tap to open
          </span>
        </button>
      )}
      <style>{`@keyframes luckySlideDown{from{transform:translateY(-120%);opacity:0}to{transform:translateY(0);opacity:1}}
@media (prefers-reduced-motion: reduce){[role=alert]{animation:none !important}}`}</style>

      <BottomSheet
        isOpen={askPermission}
        onClose={() => {
          rememberPromptDismissed();
          setAskPermission(false);
        }}
        title="Get new-order alerts"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.55 }}>
            Allow notifications so this phone rings the moment a customer places an order, even when the app is closed.
            You can turn this off any time in Android settings.
          </p>
          <button
            onClick={enable}
            style={{
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
            Turn on alerts
          </button>
          <button
            onClick={() => {
              rememberPromptDismissed();
              setAskPermission(false);
            }}
            style={{ background: 'none', border: 'none', color: '#64748B', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
          >
            Not now
          </button>
        </div>
      </BottomSheet>
    </>
  );
};

/** Settings card: phones that are signed in and receive alerts. Removing one signs it out. */
export const MyDevices: React.FC<{ showToast: (m: string, t?: 'success' | 'error' | 'warning' | 'info') => void }> = ({
  showToast,
}) => {
  const [devices, setDevices] = useState<AdminDeviceEntry[]>([]);
  const [perm, setPerm] = useState<string>('');
  const thisId = getDeviceId();

  useEffect(() => subscribeToAdminDevices(setDevices), []);
  useEffect(() => {
    getNotificationPermission().then(setPerm);
  }, []);

  const remove = async (d: AdminDeviceEntry) => {
    if (!window.confirm(`Remove "${d.deviceName}"? It will stop getting alerts and be signed out.`)) return;
    try {
      if (d.id === thisId) {
        await unregisterThisDevice();
        await adminSignOut();
      } else {
        await removeAdminDevice(d.id);
      }
      showToast('Device removed', 'success');
    } catch {
      showToast('Could not remove the device. Try again.', 'error');
    }
  };

  const turnOn = async () => {
    const ok = await requestNotificationPermission();
    if (ok) {
      await registerThisDevice().catch(() => undefined);
      setPerm('granted');
      showToast('Alerts turned on for this phone', 'success');
    } else {
      showToast('Notifications are blocked. Enable them in Android Settings > Apps > Lucky Admin.', 'warning');
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '18px',
        padding: '18px',
        border: '1px solid #E8F2F2',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B' }}>My devices</span>
        <span style={{ fontSize: '11px', color: '#4AB7B6', fontWeight: 700 }}>New-order alerts</span>
      </div>
      {isNative() && perm !== 'granted' && (
        <button
          onClick={turnOn}
          style={{
            padding: '10px',
            borderRadius: '12px',
            border: 'none',
            backgroundColor: '#FFF7ED',
            color: '#9A3412',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Alerts are off on this phone — tap to turn on
        </button>
      )}
      {devices.length === 0 && <span style={{ fontSize: '12px', color: '#94A3B8' }}>No devices yet.</span>}
      {devices.map((d) => (
        <div
          key={d.id}
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
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>
              {d.deviceName}
              {d.id === thisId ? ' (this phone)' : ''}
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              {d.fcmToken ? 'Push alerts on' : 'In-app alerts only'} • last seen{' '}
              {new Date(d.lastSeen).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <button
            onClick={() => remove(d)}
            style={{
              background: 'none',
              border: '1.5px solid #FECACA',
              color: '#B91C1C',
              borderRadius: '9999px',
              padding: '5px 10px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};
