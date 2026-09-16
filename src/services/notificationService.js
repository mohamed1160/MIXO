/* ═══════════════════════════════════════════════════════════════
   MIXO — Pluggable Notification Service
   
   Abstract channel pattern: swap providers without changing
   business logic. Currently uses console + in-app storage.
   
   To swap WhatsApp provider:
   1. Replace the `send()` in WhatsAppChannel with your API call
   2. Configure env vars: VITE_WHATSAPP_API_URL, VITE_WHATSAPP_TOKEN
   ═══════════════════════════════════════════════════════════════ */

/** Base channel interface */
class NotificationChannel {
  /** @param {{ to: string, title: string, message: string, data?: object }} payload */
  async send(payload) {
    throw new Error('send() must be implemented by subclass');
  }
}

/** In-App Notification (stored in Zustand/DB) */
class InAppChannel extends NotificationChannel {
  constructor(addNotification) {
    super();
    this.addNotification = addNotification;
  }

  async send({ title, message, type = 'info' }) {
    this.addNotification({ title, message, type });
    console.log(`[InApp] ${title}: ${message}`);
    return { success: true, channel: 'in-app' };
  }
}

/** Email Notification (placeholder — replace with SendGrid/Resend/Nodemailer) */
class EmailChannel extends NotificationChannel {
  async send({ to, title, message }) {
    // TODO: Replace with actual email API call
    // Example with Resend:
    // const res = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: { Authorization: `Bearer ${import.meta.env.VITE_RESEND_API_KEY}` },
    //   body: JSON.stringify({ from: 'MIXO <noreply@MIXO-eg.com>', to, subject: title, html: message }),
    // });
    console.log(`[Email] To: ${to} | Subject: ${title} | Body: ${message}`);
    return { success: true, channel: 'email' };
  }
}

/**
 * WhatsApp Notification
 * 
 * Currently configured for WAHA (WhatsApp HTTP API).
 * To switch to OpenWA, change the endpoint and payload format.
 * To switch to official WhatsApp Business API, update the URL
 * and use the official message template format.
 * 
 * WAHA docs: https://waha.devlike.pro/
 * OpenWA docs: https://docs.openwa.dev/
 */
class WhatsAppChannel extends NotificationChannel {
  constructor() {
    super();
    // WAHA default endpoint — change for other providers
    this.apiUrl = import.meta.env.VITE_WHATSAPP_API_URL || 'http://localhost:3000';
    this.session = import.meta.env.VITE_WHATSAPP_SESSION || 'default';
  }

  async send({ to, message }) {
    // TODO: Uncomment when WAHA/OpenWA is configured
    //
    // === WAHA Format ===
    // const res = await fetch(`${this.apiUrl}/api/sendText`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     chatId: `${to.replace('+', '')}@c.us`,
    //     text: message,
    //     session: this.session,
    //   }),
    // });
    //
    // === OpenWA Format ===
    // const res = await fetch(`${this.apiUrl}/sendText`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ args: { to: `${to}@c.us`, content: message } }),
    // });
    //
    // === Official WhatsApp Business API Format ===
    // const res = await fetch(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
    //   method: 'POST',
    //   headers: {
    //     Authorization: `Bearer ${import.meta.env.VITE_WA_BUSINESS_TOKEN}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     messaging_product: 'whatsapp',
    //     to: to.replace('+', ''),
    //     type: 'text',
    //     text: { body: message },
    //   }),
    // });

    console.log(`[WhatsApp] To: ${to} | Message: ${message}`);
    return { success: true, channel: 'whatsapp' };
  }
}

/**
 * NotificationService — orchestrates multi-channel notifications
 * 
 * Usage:
 *   const notifier = new NotificationService(addNotification);
 *   await notifier.notifyPaymentApproved(order);
 */
export class NotificationService {
  constructor(addNotification) {
    this.channels = {
      inApp: new InAppChannel(addNotification || (() => {})),
      email: new EmailChannel(),
      whatsApp: new WhatsAppChannel(),
    };
  }

  /** Send via all relevant channels */
  async sendAll({ to, phone, title, message, type }) {
    const results = [];
    // Always send in-app
    results.push(await this.channels.inApp.send({ title, message, type }));
    // Send email if address provided
    if (to) results.push(await this.channels.email.send({ to, title, message }));
    // Send WhatsApp if phone provided
    if (phone) results.push(await this.channels.whatsApp.send({ to: phone, message: `${title}\n${message}` }));
    return results;
  }

  /** Pre-built notification: Payment Approved */
  async notifyPaymentApproved(order) {
    return this.sendAll({
      to: order.customer.email,
      phone: order.customer.phone,
      title: 'Payment Approved ✅',
      message: `Your payment for order ${order.id} has been confirmed. We're preparing your order now!`,
      type: 'payment',
    });
  }

  /** Pre-built notification: Payment Rejected */
  async notifyPaymentRejected(order, reason) {
    return this.sendAll({
      to: order.customer.email,
      phone: order.customer.phone,
      title: 'Payment Issue ❌',
      message: `There was an issue with your payment for order ${order.id}. Reason: ${reason}. Please contact support.`,
      type: 'payment',
    });
  }

  /** Pre-built notification: Order Shipped */
  async notifyOrderShipped(order) {
    return this.sendAll({
      to: order.customer.email,
      phone: order.customer.phone,
      title: 'Order Shipped 📦',
      message: `Your order ${order.id} has been shipped! Expected delivery within 3-5 business days.`,
      type: 'order',
    });
  }

  /** Pre-built notification: Password Reset */
  async notifyPasswordReset(customer) {
    return this.sendAll({
      to: customer.email,
      phone: customer.phone,
      title: 'Password Reset 🔐',
      message: 'Your password has been reset. Please check your email for the new password link.',
      type: 'security',
    });
  }

  /** Custom broadcast to all or specific customer */
  async broadcast({ title, message, customers }) {
    const results = [];
    for (const c of customers) {
      results.push(
        await this.sendAll({ to: c.email, phone: c.phone, title, message, type: 'broadcast' })
      );
    }
    return results;
  }
}

export default NotificationService;

