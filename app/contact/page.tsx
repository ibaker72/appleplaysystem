import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { z } from "zod";
import { PremiumSection } from "@/components/marketing/PremiumSection";
import { sendEmail } from "@/lib/email/send";
import { contactFormEmail } from "@/lib/email/templates";
import { getResendEnv } from "@/lib/env";

export const metadata: Metadata = {
  title: "Contact | Remote Code DE Support",
  description: "Get in touch with the Remote Code DE support team for questions about BMW remote coding sessions.",
};

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address"),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
});

async function submitContact(formData: FormData) {
  "use server";
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    redirect("/contact?error=invalid");
  }

  const { name, email, subject, message } = parsed.data;
  const { fromEmail } = getResendEnv();
  const toEmail = process.env.CONTACT_EMAIL ?? fromEmail ?? "support@remotecodede.example";

  const template = contactFormEmail({
    senderName: name,
    senderEmail: email,
    subject,
    message,
  });

  await sendEmail({ to: toEmail, ...template });
  redirect("/contact?sent=1");
}

export default function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  return (
    <PremiumSection eyebrow="Contact" title="Talk with the support team">
      <ContactFormSection searchParams={searchParams} />
    </PremiumSection>
  );
}

async function ContactFormSection({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const params = await searchParams;

  if (params.sent === "1") {
    return (
      <div className="surface rounded-premium p-6">
        <p className="text-sm font-medium text-emerald-300">Message sent successfully.</p>
        <p className="mt-1 text-sm text-white/60">
          We&apos;ll get back to you within 1–2 business days.
        </p>
        <a href="/contact" className="mt-4 inline-block text-xs text-white/50 hover:text-white/80">
          Send another message
        </a>
      </div>
    );
  }

  return (
    <div className="surface rounded-premium p-6">
      {params.error === "invalid" ? (
        <p className="mb-4 rounded-xl bg-red-400/10 px-3 py-2 text-xs text-red-300">
          Please check your inputs and try again.
        </p>
      ) : null}

      <form action={submitContact} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className="mb-1.5 block text-xs text-white/50">
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Your name"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none ring-electric focus:ring-1"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="mb-1.5 block text-xs text-white/50">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none ring-electric focus:ring-1"
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact-subject" className="mb-1.5 block text-xs text-white/50">
            Subject
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            required
            placeholder="How can we help?"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none ring-electric focus:ring-1"
          />
        </div>

        <div>
          <label htmlFor="contact-message" className="mb-1.5 block text-xs text-white/50">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            placeholder="Describe your question or issue..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none ring-electric focus:ring-1"
          />
        </div>

        <button
          type="submit"
          className="rounded-xl bg-silver px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white"
        >
          Send message
        </button>
      </form>

      <p className="mt-4 text-xs text-white/35">
        For fleet partnerships: partners@remotecodede.example
      </p>
    </div>
  );
}
