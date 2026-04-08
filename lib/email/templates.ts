function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function layout(body: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background-color:#090b0f;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="margin-bottom:32px;font-size:14px;letter-spacing:0.05em;color:rgba(255,255,255,0.5);">REMOTE CODE // DE</div>
    ${body}
    <div style="margin-top:40px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.1);font-size:12px;color:rgba(255,255,255,0.35);">
      Remote Code // DE &mdash; Premium German Vehicle Feature Unlocking
    </div>
  </div>
</body>
</html>`;
}

export function orderConfirmationEmail(input: {
  orderId: string;
  totalUsd: number;
  featureNames: string[];
  customerName: string;
}) {
  const { orderId, totalUsd, featureNames, customerName } = input;
  const subject = "Order Confirmed \u2014 Remote Code DE";

  const text = [
    `Hi ${customerName},`,
    "",
    "Your order has been confirmed and payment received.",
    "",
    `Order: ${orderId}`,
    `Total: $${totalUsd.toFixed(2)}`,
    `Features: ${featureNames.join(", ")}`,
    "",
    "We'll be in touch to schedule your remote coding session.",
    "",
    "Remote Code // DE",
  ].join("\n");

  const html = layout(`
    <h1 style="font-size:22px;font-weight:600;margin:0 0 16px;">Order Confirmed</h1>
    <p style="font-size:15px;color:rgba(255,255,255,0.8);line-height:1.6;margin:0 0 24px;">
      Hi ${escapeHtml(customerName)}, your order has been confirmed and payment received.
    </p>
    <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:20px;margin-bottom:24px;">
      <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:4px;">Order</div>
      <div style="font-size:14px;margin-bottom:16px;">${escapeHtml(orderId)}</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:4px;">Total</div>
      <div style="font-size:14px;margin-bottom:16px;">$${totalUsd.toFixed(2)}</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:4px;">Features</div>
      <div style="font-size:14px;">${featureNames.map(escapeHtml).join(", ")}</div>
    </div>
    <p style="font-size:14px;color:rgba(255,255,255,0.6);line-height:1.6;">
      We&rsquo;ll be in touch to schedule your remote coding session.
    </p>
  `);

  return { subject, html, text };
}

export function bookingConfirmationEmail(input: {
  orderId: string;
  bookingId: string;
  customerName: string;
}) {
  const { orderId, bookingId, customerName } = input;
  const subject = "Session Booked \u2014 Remote Code DE";

  const text = [
    `Hi ${customerName},`,
    "",
    "Your remote coding session has been created.",
    "",
    `Booking: ${bookingId}`,
    `Order: ${orderId}`,
    "",
    "You'll receive setup instructions and a reminder before your session.",
    "",
    "Remote Code // DE",
  ].join("\n");

  const html = layout(`
    <h1 style="font-size:22px;font-weight:600;margin:0 0 16px;">Session Booked</h1>
    <p style="font-size:15px;color:rgba(255,255,255,0.8);line-height:1.6;margin:0 0 24px;">
      Hi ${escapeHtml(customerName)}, your remote coding session has been created.
    </p>
    <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:20px;margin-bottom:24px;">
      <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:4px;">Booking</div>
      <div style="font-size:14px;margin-bottom:16px;">${escapeHtml(bookingId)}</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:4px;">Order</div>
      <div style="font-size:14px;">${escapeHtml(orderId)}</div>
    </div>
    <p style="font-size:14px;color:rgba(255,255,255,0.6);line-height:1.6;">
      You&rsquo;ll receive setup instructions and a reminder before your session.
    </p>
  `);

  return { subject, html, text };
}

export function bookingReminderEmail(input: {
  orderId: string;
  startsAt: string;
  customerName: string;
  setupLink: string;
}) {
  const { orderId, startsAt, customerName, setupLink } = input;
  const subject = "Session Tomorrow \u2014 Remote Code DE";
  const formattedTime = new Date(startsAt).toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });

  const text = [
    `Hi ${customerName},`,
    "",
    "Your remote coding session is scheduled for tomorrow.",
    "",
    `Time: ${formattedTime}`,
    `Order: ${orderId}`,
    "",
    `Please review the setup instructions: ${setupLink}`,
    "",
    "Remote Code // DE",
  ].join("\n");

  const html = layout(`
    <h1 style="font-size:22px;font-weight:600;margin:0 0 16px;">Session Tomorrow</h1>
    <p style="font-size:15px;color:rgba(255,255,255,0.8);line-height:1.6;margin:0 0 24px;">
      Hi ${escapeHtml(customerName)}, your remote coding session is scheduled for tomorrow.
    </p>
    <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:20px;margin-bottom:24px;">
      <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:4px;">Scheduled Time</div>
      <div style="font-size:14px;margin-bottom:16px;">${escapeHtml(formattedTime)}</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:4px;">Order</div>
      <div style="font-size:14px;">${escapeHtml(orderId)}</div>
    </div>
    <a href="${escapeHtml(setupLink)}" style="display:inline-block;background:#e2e2e2;color:#000;text-decoration:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:500;">Review Setup Instructions</a>
  `);

  return { subject, html, text };
}

export function contactFormEmail(input: {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
}) {
  const { senderName, senderEmail, subject, message } = input;
  const emailSubject = `Contact Form: ${subject}`;

  const text = [
    `From: ${senderName} <${senderEmail}>`,
    `Subject: ${subject}`,
    "",
    message,
  ].join("\n");

  const html = layout(`
    <h1 style="font-size:22px;font-weight:600;margin:0 0 16px;">New Contact Message</h1>
    <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:20px;margin-bottom:24px;">
      <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:4px;">From</div>
      <div style="font-size:14px;margin-bottom:16px;">${escapeHtml(senderName)} &lt;${escapeHtml(senderEmail)}&gt;</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:4px;">Subject</div>
      <div style="font-size:14px;margin-bottom:16px;">${escapeHtml(subject)}</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:4px;">Message</div>
      <div style="font-size:14px;white-space:pre-wrap;">${escapeHtml(message)}</div>
    </div>
  `);

  return { subject: emailSubject, html, text };
}
