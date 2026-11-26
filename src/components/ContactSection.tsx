import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import {
  AlertCircle,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Send,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { ContactDetails } from '../types/portfolio';
import {
  formatPhoneForTel,
  formatPhoneForWhatsApp,
  sanitizeExternalUrl,
} from '../types/portfolio';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { GitHubIcon, LinkedInIcon, WhatsAppIcon } from './BrandIcons';
import { Reveal } from './Reveal';

interface ContactSectionProps {
  contact: ContactDetails;
  prefilledSubject: string;
  onEditContact: () => void;
}

interface ContactFormValues {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export function ContactSection({
  contact,
  prefilledSubject,
  onEditContact,
}: ContactSectionProps) {
  const [form, setForm] = useState<ContactFormValues>({
    fullName: '',
    email: '',
    phone: '',
    subject: prefilledSubject,
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormValues, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverSupabaseReady, setServerSupabaseReady] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    type: 'success' | 'error';
    message: string;
    referenceId?: string;
  } | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefilledSubject) {
      setForm((prev) => ({ ...prev, subject: prefilledSubject }));
    }
  }, [prefilledSubject]);

  useEffect(() => {
    if (isSupabaseConfigured) return;
    let active = true;
    fetch('/api/contact/status')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.supabaseConfigured === true) {
          setServerSupabaseReady(true);
        }
      })
      .catch(() => {
        // Ignore status check errors
      });
    return () => {
      active = false;
    };
  }, []);

  const validateClient = (values: ContactFormValues) => {
    const nextErrors: Partial<Record<keyof ContactFormValues, string>> = {};
    const name = values.fullName.trim();
    const email = values.email.trim();
    const phone = values.phone.trim();
    const subject = values.subject.trim();
    const message = values.message.trim();

    if (name.length < 2 || name.length > 120) {
      nextErrors.fullName = 'Please enter your full name (2 to 120 characters).';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (phone && (!/^[+\d\s().-]{7,25}$/.test(phone) || phone.length > 40)) {
      nextErrors.phone = 'Please enter a valid phone number or leave it blank.';
    }
    if (subject.length < 3 || subject.length > 160) {
      nextErrors.subject = 'Please provide a subject (3 to 160 characters).';
    }
    if (message.length < 10 || message.length > 4000) {
      nextErrors.message = 'Please enter a message between 10 and 4000 characters.';
    }
    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitResult(null);

    const validationErrors = validateClient(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    if (!supabase) {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.ok) {
          if (data.fieldErrors && typeof data.fieldErrors === 'object') {
            setErrors(data.fieldErrors);
          }
          setSubmitResult({
            type: 'error',
            message:
              data.error ||
              'Add SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY) in Settings -> Secrets to save submissions to Supabase.',
          });
          return;
        }
        setSubmitResult({
          type: 'success',
          message: data.message,
          referenceId: data.id,
        });
        setForm({
          fullName: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } catch {
        setSubmitResult({
          type: 'error',
          message:
            'Add SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY) in Settings -> Secrets to connect your Supabase contacts table.',
        });
      } finally {
        setSubmitting(false);
      }
      return;
    }

    try {
      const { error } = await supabase.from('contacts').insert([
        {
          full_name: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || null,
          subject: form.subject.trim(),
          message: form.message.trim(),
        },
      ]);

      if (error) {
        const missingTable =
          error.code === '42P01' ||
          error.code === 'PGRST205' ||
          /contacts/i.test(error.message || '');
        const rlsBlocked = error.code === '42501';

        setSubmitResult({
          type: 'error',
          message: missingTable
            ? 'The contacts table has not been created in Supabase yet. Run supabase/schema.sql in your Supabase SQL Editor and try again.'
            : rlsBlocked
              ? 'Supabase Row Level Security blocked the insert. Run the insert policy in supabase/schema.sql in your Supabase SQL Editor.'
              : 'Could not save your message to Supabase right now. Please try again or reach out directly via email.',
        });
        return;
      }

      setSubmitResult({
        type: 'success',
        message: 'Your message has been saved to Supabase. Thank you for reaching out.',
      });
      setForm({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch {
      setSubmitResult({
        type: 'error',
        message:
          'Unable to reach Supabase right now. Please check your connection or email directly using the contact details on the left.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const safeLinkedIn = sanitizeExternalUrl(contact.linkedinUrl) || 'https://www.linkedin.com';
  const safeGitHub = sanitizeExternalUrl(contact.githubUrl) || 'https://github.com';
  const telHref = formatPhoneForTel(contact.phone);
  const whatsAppHref = formatPhoneForWhatsApp(contact.whatsappNumber, contact.phone);

  return (
    <section id="contact" className="warm-section-bg py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#f47721]">Let&apos;s Work Together</p>
            <h2 className="mt-1.5 text-3xl font-bold tracking-tight text-[#101c30] sm:text-4xl">
              Have a project or job opportunity? Let&apos;s connect.
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Side: Direct Contact Information in Warm-Lit Secondary Navy */}
          <Reveal className="lg:col-span-5">
            <div className="hero-orange-bg flex h-full flex-col justify-between rounded-2xl border border-[#f47721]/25 p-6 text-white shadow-[0_18px_36px_-18px_rgba(16,28,48,0.45)] sm:p-8">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-white">Contact Details</h3>
                    <p className="mt-1 text-sm text-[#cbd5e1]">
                      Open to IT infrastructure leadership roles, consulting, and digital
                      projects.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onEditContact}
                    aria-label="Edit contact details"
                    title="Edit contact placeholders"
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-[#101c30] text-[#f47721] transition-colors hover:border-[#f47721] hover:bg-[#f47721] hover:text-[#101c30] cursor-pointer"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>

                <dl className="mt-7 space-y-5">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#101c30] text-[#f47721]">
                      <Mail className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-[#f47721]">Email Address</dt>
                      <dd className="mt-0.5 text-sm font-medium text-white break-all">
                        <a
                          href={`mailto:${contact.email}`}
                          className="transition-colors hover:text-[#f47721]"
                        >
                          {contact.email}
                        </a>
                      </dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#101c30] text-[#f47721]">
                      <Phone className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-[#f47721]">Phone Number</dt>
                      <dd className="mt-0.5 text-sm font-medium text-white tabular-nums">
                        <a
                          href={telHref || '#contact'}
                          className="transition-colors hover:text-[#f47721]"
                        >
                          {contact.phone}
                        </a>
                      </dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#101c30] text-[#f47721]">
                      <MapPin className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-[#f47721]">Location</dt>
                      <dd className="mt-0.5 text-sm font-medium text-white">{contact.location}</dd>
                    </div>
                  </div>
                </dl>
              </div>

              {/* Direct Call, WhatsApp Call & Social Links */}
              <div className="mt-8 border-t border-white/15 pt-6">
                <p className="text-xs font-semibold text-[#f47721]">Direct Call &amp; Connect</p>
                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {telHref && (
                    <a
                      href={telHref}
                      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#f47721] px-4 py-2.5 text-xs font-semibold text-[#101c30] shadow-[0_8px_18px_-8px_rgba(244,119,33,0.6)] transition-colors hover:bg-[#ff8a3a]"
                    >
                      <Phone className="h-4 w-4" aria-hidden="true" />
                      <span>Call Now</span>
                    </a>
                  )}
                  {whatsAppHref && (
                    <a
                      href={whatsAppHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-[#f47721]/60 bg-[#101c30] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:border-[#f47721] hover:bg-[#f47721] hover:text-[#101c30]"
                    >
                      <WhatsAppIcon className="h-4 w-4 text-[#f47721] transition-colors group-hover:text-[#101c30]" />
                      <span>WhatsApp Call</span>
                    </a>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <a
                    href={safeLinkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-lg border border-white/15 bg-[#101c30] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:border-[#f47721] hover:text-[#f47721]"
                  >
                    <LinkedInIcon className="h-4 w-4 text-[#f47721]" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href={safeGitHub}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-lg border border-white/15 bg-[#101c30] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:border-[#f47721] hover:text-[#f47721]"
                  >
                    <GitHubIcon className="h-4 w-4 text-[#f47721]" />
                    <span>GitHub</span>
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right Side: Validated Contact Form */}
          <Reveal delayMs={80} className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-2xl border border-[#f3dfd0] bg-white p-6 shadow-[0_14px_34px_-16px_rgba(244,119,33,0.16)] sm:p-8"
            >
              <h3 className="text-xl font-bold text-[#101c30]">Send a Message</h3>
              <p className="mt-1 text-xs leading-relaxed text-[#64748b]">
                {isSupabaseConfigured || serverSupabaseReady
                  ? 'Submissions are validated and saved directly to your Supabase contacts table.'
                  : 'Add SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY) in Settings -> Secrets to store submissions in your Supabase contacts table.'}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-fullName"
                    className="block text-xs font-semibold text-[#101c30]"
                  >
                    Full Name <span className="text-[#f47721]">*</span>
                  </label>
                  <input
                    id="contact-fullName"
                    name="fullName"
                    type="text"
                    required
                    autoComplete="name"
                    value={form.fullName}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, fullName: e.target.value }));
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                    }}
                    placeholder="Your full name"
                    className="mt-1.5 w-full rounded-lg border border-[#f3dfd0] bg-white px-3.5 py-2.5 text-sm text-[#101c30] placeholder:text-[#64748b]/70 focus:border-[#f47721] focus:outline-none"
                    aria-invalid={Boolean(errors.fullName)}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs font-medium text-[#c2540a]" role="alert">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-semibold text-[#101c30]"
                  >
                    Email Address <span className="text-[#f47721]">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, email: e.target.value }));
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder="you@company.com"
                    className="mt-1.5 w-full rounded-lg border border-[#f3dfd0] bg-white px-3.5 py-2.5 text-sm text-[#101c30] placeholder:text-[#64748b]/70 focus:border-[#f47721] focus:outline-none"
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs font-medium text-[#c2540a]" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-phone"
                    className="block text-xs font-semibold text-[#101c30]"
                  >
                    Phone Number
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, phone: e.target.value }));
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    placeholder="+91 98765 43210 (optional)"
                    className="mt-1.5 w-full rounded-lg border border-[#f3dfd0] bg-white px-3.5 py-2.5 text-sm text-[#101c30] placeholder:text-[#64748b]/70 focus:border-[#f47721] focus:outline-none"
                    aria-invalid={Boolean(errors.phone)}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs font-medium text-[#c2540a]" role="alert">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-semibold text-[#101c30]"
                  >
                    Subject <span className="text-[#f47721]">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, subject: e.target.value }));
                      if (errors.subject) setErrors((prev) => ({ ...prev, subject: undefined }));
                    }}
                    placeholder="Infrastructure role, consulting, or project"
                    className="mt-1.5 w-full rounded-lg border border-[#f3dfd0] bg-white px-3.5 py-2.5 text-sm text-[#101c30] placeholder:text-[#64748b]/70 focus:border-[#f47721] focus:outline-none"
                    aria-invalid={Boolean(errors.subject)}
                  />
                  {errors.subject && (
                    <p className="mt-1 text-xs font-medium text-[#c2540a]" role="alert">
                      {errors.subject}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-semibold text-[#101c30]"
                >
                  Message <span className="text-[#f47721]">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  value={form.message}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, message: e.target.value }));
                    if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                  }}
                  placeholder="Share details about the opportunity, project scope, or timeline..."
                  className="mt-1.5 w-full rounded-lg border border-[#f3dfd0] bg-white px-3.5 py-2.5 text-sm text-[#101c30] placeholder:text-[#64748b]/70 focus:border-[#f47721] focus:outline-none"
                  aria-invalid={Boolean(errors.message)}
                />
                {errors.message && (
                  <p className="mt-1 text-xs font-medium text-[#c2540a]" role="alert">
                    {errors.message}
                  </p>
                )}
              </div>

              <AnimatePresence mode="wait">
                {submitResult && (
                  <motion.div
                    key={`${submitResult.type}-${submitResult.message}`}
                    role={submitResult.type === 'error' ? 'alert' : 'status'}
                    initial={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: 12, scale: 0.97 }
                    }
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: -8, scale: 0.98 }
                    }
                    transition={
                      prefersReducedMotion
                        ? { duration: 0.15 }
                        : { type: 'spring', stiffness: 360, damping: 28, mass: 0.85 }
                    }
                    className={`mt-5 relative flex items-start gap-3.5 overflow-hidden rounded-xl border p-4 text-sm ${
                      submitResult.type === 'success'
                        ? 'border-[#f47721]/35 bg-[#fff6ef] text-[#101c30] shadow-[0_10px_24px_-14px_rgba(244,119,33,0.45)]'
                        : 'border-[#f47721]/50 bg-[#f47721]/10 text-[#101c30]'
                    }`}
                  >
                    {submitResult.type === 'success' ? (
                      <div className="relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center">
                        {!prefersReducedMotion && (
                          <motion.span
                            aria-hidden="true"
                            initial={{ scale: 0.65, opacity: 0.7 }}
                            animate={{ scale: 1.55, opacity: 0 }}
                            transition={{ duration: 0.75, ease: 'easeOut' }}
                            className="absolute inset-0 rounded-full bg-[#f47721]/35"
                          />
                        )}
                        <motion.span
                          initial={prefersReducedMotion ? false : { scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 420, damping: 22 }}
                          className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#f47721] text-white shadow-xs"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-5 w-5"
                            fill="none"
                            aria-hidden="true"
                          >
                            <motion.path
                              d="M5 13l4 4L19 7"
                              stroke="currentColor"
                              strokeWidth="2.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.42, delay: 0.12, ease: 'easeOut' }}
                            />
                          </svg>
                        </motion.span>
                      </div>
                    ) : (
                      <AlertCircle
                        className="mt-0.5 h-5 w-5 shrink-0 text-[#c2540a]"
                        aria-hidden="true"
                      />
                    )}
                    <div className="min-w-0 flex-1 pr-6">
                      <motion.p
                        initial={prefersReducedMotion ? false : { opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, delay: 0.08 }}
                        className="font-semibold text-[#101c30]"
                      >
                        {submitResult.type === 'success'
                          ? 'Message Sent Successfully'
                          : 'Submission Issue'}
                      </motion.p>
                      <motion.p
                        initial={prefersReducedMotion ? false : { opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.28, delay: 0.14 }}
                        className="mt-0.5 text-xs leading-relaxed text-[#5a6577]"
                      >
                        {submitResult.message}
                      </motion.p>
                      {submitResult.referenceId && (
                        <p className="mt-1 text-xs font-medium text-[#172942] tabular-nums">
                          Reference: {submitResult.referenceId}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setSubmitResult(null)}
                      aria-label="Dismiss notification"
                      className="absolute top-3 right-3 inline-flex h-7 w-7 items-center justify-center rounded-md text-[#64748b] transition-colors hover:bg-[#101c30]/5 hover:text-[#101c30] cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg bg-[#f47721] px-6 py-3 text-sm font-semibold text-[#101c30] whitespace-nowrap shrink-0 shadow-[0_10px_22px_-10px_rgba(244,119,33,0.55)] transition-all duration-150 hover:bg-[#ff8a3a] disabled:opacity-65 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" aria-hidden="true" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                <a
                  href={`mailto:${contact.email}?subject=${encodeURIComponent(
                    form.subject || 'Portfolio Inquiry'
                  )}`}
                  className="text-xs font-semibold text-[#101c30] underline underline-offset-4 hover:text-[#f47721]"
                >
                  Or open in your email client
                </a>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
