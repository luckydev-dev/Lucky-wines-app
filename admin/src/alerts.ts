import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';
import { PushNotifications } from '@capacitor/push-notifications';
import { Device } from '@capacitor/device';
import { registerAdminDevice, removeAdminDevice, type Order } from '@lucky/shared';

/** Android notification channel used for every new-order alert (importance 5 = max, heads-up + sound). */
export const ORDER_CHANNEL_ID = 'new_orders';

const DEVICE_ID_KEY = 'lucky_admin_device_id';
const PROMPT_DISMISSED_KEY = 'lucky_admin_notif_prompt_v1';

export const isNative = (): boolean => Capacitor.isNativePlatform();

// ---------------------------------------------------------------- device identity

export function getDeviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = `dev_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch {
    return 'dev_session';
  }
}

export async function getDeviceName(): Promise<string> {
  try {
    const info = await Device.getInfo();
    const name = [info.manufacturer, info.model].filter(Boolean).join(' ').trim();
    return name || (isNative() ? 'Android phone' : 'Web browser');
  } catch {
    return isNative() ? 'Android phone' : 'Web browser';
  }
}

export const wasPromptDismissed = (): boolean => {
  try {
    return localStorage.getItem(PROMPT_DISMISSED_KEY) === 'yes';
  } catch {
    return false;
  }
};

export const rememberPromptDismissed = (): void => {
  try {
    localStorage.setItem(PROMPT_DISMISSED_KEY, 'yes');
  } catch {
    /* ignore */
  }
};

// ---------------------------------------------------------------- in-app sound + vibration

let audioCtx: AudioContext | null = null;

/** Two-tone chime generated with WebAudio (no sound file needed). May stay silent until the user has tapped once. */
export function playChime(): void {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    audioCtx = audioCtx ?? new Ctx();
    if (audioCtx.state === 'suspended') void audioCtx.resume();
    const now = audioCtx.currentTime;
    [880, 1175].forEach((freq, i) => {
      const osc = audioCtx!.createOscillator();
      const gain = audioCtx!.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const start = now + i * 0.18;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.35, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.32);
      osc.connect(gain).connect(audioCtx!.destination);
      osc.start(start);
      osc.stop(start + 0.34);
    });
  } catch {
    /* sound is a nice-to-have */
  }
}

export async function buzz(): Promise<void> {
  try {
    if (isNative()) {
      await Haptics.impact({ style: ImpactStyle.Heavy });
      await Haptics.vibrate({ duration: 300 });
    } else if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  } catch {
    /* ignore */
  }
}

// ---------------------------------------------------------------- notifications

export type NotifPermission = 'granted' | 'denied' | 'prompt';

export async function getNotificationPermission(): Promise<NotifPermission> {
  if (!isNative()) return 'denied';
  try {
    const res = await LocalNotifications.checkPermissions();
    if (res.display === 'granted') return 'granted';
    if (res.display === 'denied') return 'denied';
    return 'prompt';
  } catch {
    return 'denied';
  }
}

async function ensureChannels(): Promise<void> {
  const channel = {
    id: ORDER_CHANNEL_ID,
    name: 'New orders',
    description: 'Alerts when a customer places an order',
    importance: 5 as const,
    visibility: 1 as const,
    vibration: true,
    lights: true,
  };
  try {
    await LocalNotifications.createChannel(channel);
  } catch {
    /* channel may already exist */
  }
  try {
    await PushNotifications.createChannel(channel);
  } catch {
    /* channel may already exist */
  }
}

/** Shows the system permission dialog (call this only after our own explanation screen). */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNative()) return false;
  try {
    await ensureChannels();
    const res = await LocalNotifications.requestPermissions();
    return res.display === 'granted';
  } catch {
    return false;
  }
}

let pushListenersAttached = false;

/**
 * Registers this phone for push (FCM) and saves its token under admins/{uid}/devices/{deviceId}.
 * Push only works when google-services.json for wine.admin.lucky was included in the build;
 * without it the call fails quietly and the app still alerts while it is open.
 */
export async function registerThisDevice(): Promise<{ push: boolean }> {
  const deviceId = getDeviceId();
  const deviceName = await getDeviceName();
  const platform = isNative() ? Capacitor.getPlatform() : 'web';
  // Always list the device so the owner can see/remove it
  await registerAdminDevice(deviceId, { deviceName, platform });

  if (!isNative()) return { push: false };

  try {
    await ensureChannels();
    if (!pushListenersAttached) {
      pushListenersAttached = true;
      await PushNotifications.addListener('registration', (token) => {
        registerAdminDevice(deviceId, { deviceName, platform, fcmToken: token.value }).catch((e) =>
          console.warn('Saving push token failed:', e)
        );
      });
      await PushNotifications.addListener('registrationError', (err) => {
        console.warn('Push registration failed (is google-services.json included?):', err);
      });
    }
    const perm = await PushNotifications.checkPermissions();
    const granted =
      perm.receive === 'granted' || (perm.receive === 'prompt' && (await PushNotifications.requestPermissions()).receive === 'granted');
    if (!granted) return { push: false };
    await PushNotifications.register();
    return { push: true };
  } catch (e) {
    console.warn('Push setup skipped:', e);
    return { push: false };
  }
}

/** Removes this phone from the list (used on sign out and from "My devices"). */
export async function unregisterThisDevice(): Promise<void> {
  try {
    await removeAdminDevice(getDeviceId());
  } catch (e) {
    console.warn('Could not remove device entry:', e);
  }
}

/** Shows a system notification for a new order while the app is in the background. */
export async function notifyNewOrder(order: Order): Promise<void> {
  if (!isNative()) return;
  try {
    const itemCount = order.items.reduce((sum, it) => sum + (it.quantity || 1), 0);
    await LocalNotifications.schedule({
      notifications: [
        {
          id: Math.floor(Date.now() % 2147483000),
          title: `New order #${order.id}`,
          body: `${order.userName || 'Customer'} • ${itemCount} item${itemCount === 1 ? '' : 's'} • ₹${order.total.toLocaleString('en-IN')} • ${
            order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI'
          }`,
          channelId: ORDER_CHANNEL_ID,
          extra: { orderId: order.id },
        },
      ],
    });
  } catch (e) {
    console.warn('Local notification failed:', e);
  }
}

/** Calls back with the order id when the owner taps a notification (local or push). Returns a cleanup function. */
export async function listenForNotificationTaps(onOrder: (orderId: string) => void): Promise<() => void> {
  if (!isNative()) return () => {};
  const handles: Array<{ remove: () => Promise<void> }> = [];
  try {
    handles.push(
      await LocalNotifications.addListener('localNotificationActionPerformed', (e) => {
        const id = (e.notification.extra as { orderId?: string } | undefined)?.orderId;
        if (id) onOrder(id);
      })
    );
    handles.push(
      await PushNotifications.addListener('pushNotificationActionPerformed', (e) => {
        const id = (e.notification.data as { orderId?: string } | undefined)?.orderId;
        if (id) onOrder(id);
      })
    );
  } catch (e) {
    console.warn('Notification tap listeners unavailable:', e);
  }
  return () => handles.forEach((h) => void h.remove());
}
