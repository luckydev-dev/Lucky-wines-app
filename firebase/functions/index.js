/**
 * Sends a push notification to every admin phone when a customer places an order.
 * Needs the Firebase Blaze (pay-as-you-go) plan to deploy. Not tested end-to-end in this repo.
 *
 * Deploy:  cd firebase/functions && npm install && cd ../.. && firebase deploy --only functions
 * Set the region/instance below to match your Realtime Database.
 */
const { onValueCreated } = require('firebase-functions/v2/database');
const logger = require('firebase-functions/logger');
const admin = require('firebase-admin');

admin.initializeApp();

exports.notifyAdminsOfNewOrder = onValueCreated(
  { ref: '/orders/{orderId}', region: 'asia-southeast1', instance: 'lucky-wines-default-rtdb' },
  async (event) => {
    const order = event.data.val() || {};
    const orderId = event.params.orderId;
    const db = admin.database();

    const adminsSnap = await db.ref('admins').get();
    const targets = []; // { token, path }
    adminsSnap.forEach((adminNode) => {
      const devices = adminNode.child('devices');
      devices.forEach((dev) => {
        const token = dev.child('fcmToken').val();
        if (token) targets.push({ token, path: `admins/${adminNode.key}/devices/${dev.key}` });
      });
    });
    if (targets.length === 0) {
      logger.info('No admin devices with push tokens');
      return;
    }

    const count = Array.isArray(order.items) ? order.items.reduce((n, i) => n + (i.quantity || 1), 0) : 0;
    const method = order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI';
    const res = await admin.messaging().sendEachForMulticast({
      tokens: targets.map((t) => t.token),
      notification: {
        title: `New order #${orderId}`,
        body: `${order.userName || 'Customer'} • ${count} item${count === 1 ? '' : 's'} • ₹${order.total} • ${method}`,
      },
      data: { orderId: String(orderId) },
      android: { priority: 'high', notification: { channelId: 'new_orders', sound: 'default' } },
    });

    // Drop tokens FCM says are dead
    const removals = [];
    res.responses.forEach((r, i) => {
      const code = r.error && r.error.code;
      if (code === 'messaging/registration-token-not-registered' || code === 'messaging/invalid-registration-token') {
        removals.push(db.ref(`${targets[i].path}/fcmToken`).remove());
      }
    });
    await Promise.all(removals);
    logger.info(`Sent ${res.successCount}/${targets.length} notifications for ${orderId}`);
  }
);
