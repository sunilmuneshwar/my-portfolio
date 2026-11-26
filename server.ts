import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';

// Basic in-memory sliding-window rate limiter per IP for /api/contact
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX_REQUESTS = 8;
const rateBuckets = new Map<string, number[]>();

function isRateLimited(clientKey: string): boolean {
  const now = Date.now();
  const timestamps = (rateBuckets.get(clientKey) || []).filter(
    (ts) => now - ts < RATE_WINDOW_MS
  );
  if (timestamps.length >= RATE_MAX_REQUESTS) {
    rateBuckets.set(clientKey, timestamps);
    return true;
  }
  timestamps.push(now);
  rateBuckets.set(clientKey, timestamps);
  return false;
}

function cleanText(value: unknown, maxLen: number): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, maxLen);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254;
}

function isSafeHttpsUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'https:') return false;
    const host = parsed.hostname.toLowerCase();
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '::1' ||
      host === '0.0.0.0' ||
      host === '169.254.169.254' ||
      host.startsWith('10.') ||
      host.startsWith('192.168.') ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function isValidSupabaseUrl(rawUrl: string): boolean {
  if (!isSafeHttpsUrl(rawUrl)) return false;
  try {
    const parsed = new URL(rawUrl);
    return parsed.hostname.endsWith('.supabase.co') || parsed.hostname.endsWith('.supabase.in');
  } catch {
    return false;
  }
}

const DEFAULT_SUPABASE_URL = 'https://dwxehuzgekdmkvqmmtok.supabase.co';

let cachedSupabaseClient: SupabaseClient | null = null;
let cachedSupabaseConfigKey = '';

function getSupabaseClient(): SupabaseClient | null {
  const rawUrl =
    process.env.SUPABASE_URL?.trim() ||
    process.env.VITE_SUPABASE_URL?.trim() ||
    DEFAULT_SUPABASE_URL;
  const apiKey =
    process.env.SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.SUPABASE_ANON_KEY?.trim() ||
    process.env.VITE_SUPABASE_ANON_KEY?.trim() ||
    process.env.SUPABASE_KEY?.trim() ||
    process.env.VITE_SUPABASE_KEY?.trim() ||
    process.env.SUPABASE_API_KEY?.trim() ||
    process.env.VITE_SUPABASE_API_KEY?.trim() ||
    '';

  if (!rawUrl || !apiKey || !isValidSupabaseUrl(rawUrl)) {
    return null;
  }

  const configKey = `${rawUrl}::${apiKey.length}`;
  if (cachedSupabaseClient && cachedSupabaseConfigKey === configKey) {
    return cachedSupabaseClient;
  }

  cachedSupabaseClient = createClient(rawUrl, apiKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  cachedSupabaseConfigKey = configKey;
  return cachedSupabaseClient;
}

interface ContactRecord {
  id: string;
  receivedAt: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  storageMode: 'supabase' | 'server_inbox';
  deliveryMode: 'email' | 'webhook' | 'none';
}

const INBOX_FILE = path.join(os.tmpdir(), 'sunil-muneshwar-portfolio-inquiries.jsonl');

async function persistFallbackInquiry(record: ContactRecord): Promise<void> {
  const line = `${JSON.stringify(record)}\n`;
  await fs.appendFile(INBOX_FILE, line, { encoding: 'utf8', mode: 0o600 });
}

async function startServer(): Promise<void> {
  const app = express();
  app.set('trust proxy', 1);
  app.use(express.json({ limit: '16kb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/contact/status', (_req: Request, res: Response) => {
    const supabaseConfigured = Boolean(getSupabaseClient());
    const hasResend = Boolean(
      process.env.RESEND_API_KEY?.trim() && process.env.CONTACT_TO_EMAIL?.trim()
    );
    const hasWebhook = Boolean(
      process.env.CONTACT_WEBHOOK_URL?.trim() &&
        isSafeHttpsUrl(process.env.CONTACT_WEBHOOK_URL.trim())
    );
    res.json({
      supabaseConfigured,
      liveEmailConfigured: hasResend || hasWebhook,
      provider: supabaseConfigured
        ? 'supabase'
        : hasResend
          ? 'resend'
          : hasWebhook
            ? 'webhook'
            : 'server_inbox',
    });
  });

  app.post('/api/contact', async (req: Request, res: Response) => {
    const clientIp = req.ip || 'unknown';
    if (isRateLimited(clientIp)) {
      res.status(429).json({
        ok: false,
        error: 'Too many submissions. Please wait a few minutes before sending another message.',
      });
      return;
    }

    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const fullName = cleanText(body.fullName, 120);
    const email = cleanText(body.email, 254);
    const phone = cleanText(body.phone, 40);
    const subject = cleanText(body.subject, 160);
    const message = cleanText(body.message, 4000);

    const fieldErrors: Record<string, string> = {};
    if (fullName.length < 2) {
      fieldErrors.fullName = 'Please enter your full name (at least 2 characters).';
    }
    if (!isValidEmail(email)) {
      fieldErrors.email = 'Please enter a valid email address.';
    }
    if (phone && !/^[+\d\s().-]{7,25}$/.test(phone)) {
      fieldErrors.phone = 'Please enter a valid phone number or leave this field blank.';
    }
    if (subject.length < 3) {
      fieldErrors.subject = 'Please provide a brief subject (at least 3 characters).';
    }
    if (message.length < 10) {
      fieldErrors.message = 'Please enter a message of at least 10 characters.';
    }

    if (Object.keys(fieldErrors).length > 0) {
      res.status(400).json({
        ok: false,
        error: 'Please review the highlighted fields and try again.',
        fieldErrors,
      });
      return;
    }

    const inquiryId = `inq_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
    const receivedAt = new Date().toISOString();

    const supabase = getSupabaseClient();
    let storageMode: 'supabase' | 'server_inbox' = 'server_inbox';

    if (supabase) {
      const { error: dbError } = await supabase.from('contacts').insert({
        full_name: fullName,
        email,
        phone,
        subject,
        message,
        created_at: receivedAt,
      });

      if (dbError) {
        console.error('Supabase insert error code:', dbError.code || 'unknown');
        const missingTable =
          dbError.code === '42P01' ||
          dbError.code === 'PGRST205' ||
          /contacts/i.test(dbError.message || '');
        const rlsBlocked = dbError.code === '42501';

        res.status(502).json({
          ok: false,
          error: missingTable
            ? 'Supabase is connected, but the contacts table has not been created yet. Run supabase/schema.sql in your Supabase SQL Editor and try again.'
            : rlsBlocked
              ? 'Supabase rejected the insert due to Row Level Security. Run the insert policy in supabase/schema.sql in your Supabase SQL Editor.'
              : 'Unable to save your message to Supabase right now. Please verify your Supabase project settings and try again.',
        });
        return;
      }

      storageMode = 'supabase';
    }

    // Optional additional notification via Resend or HTTPS Webhook
    const resendKey = process.env.RESEND_API_KEY?.trim();
    const toEmail = process.env.CONTACT_TO_EMAIL?.trim();
    const fromEmail =
      process.env.CONTACT_FROM_EMAIL?.trim() || 'Portfolio Contact <onboarding@resend.dev>';
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL?.trim();

    let deliveryMode: 'email' | 'webhook' | 'none' = 'none';

    try {
      if (resendKey && toEmail) {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [toEmail],
            reply_to: email,
            subject: `[Portfolio Inquiry] ${subject}`,
            text: [
              `New portfolio inquiry for Sunil Muneshwar`,
              `Reference ID: ${inquiryId}`,
              `Name: ${fullName}`,
              `Email: ${email}`,
              `Phone: ${phone || 'Not provided'}`,
              `Subject: ${subject}`,
              ``,
              `Message:`,
              message,
            ].join('\n'),
          }),
        });

        if (emailResponse.ok) {
          deliveryMode = 'email';
        }
      } else if (webhookUrl && isSafeHttpsUrl(webhookUrl)) {
        const hookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: inquiryId,
            receivedAt,
            fullName,
            email,
            phone,
            subject,
            message,
          }),
        });

        if (hookResponse.ok) {
          deliveryMode = 'webhook';
        }
      }
    } catch {
      // Do not fail the user submission if optional notification forwarding fails after DB save
    }

    if (storageMode !== 'supabase') {
      try {
        await persistFallbackInquiry({
          id: inquiryId,
          receivedAt,
          fullName,
          email,
          phone,
          subject,
          message,
          storageMode,
          deliveryMode,
        });
      } catch {
        res.status(500).json({
          ok: false,
          error: 'Unable to record your inquiry right now. Please reach out directly via email.',
        });
        return;
      }
    }

    const responseMessage =
      storageMode === 'supabase'
        ? deliveryMode === 'email'
          ? 'Your message has been saved to Supabase and forwarded via email. Thank you for reaching out.'
          : 'Your message has been saved securely to the Supabase database. Thank you for reaching out.'
        : 'Your message was validated and recorded temporarily on the server. Add SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in Settings -> Secrets to store submissions in Supabase.';

    res.status(200).json({
      ok: true,
      id: inquiryId,
      storageMode,
      deliveryMode,
      message: responseMessage,
    });
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
