import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { BRAND_CONTACT } from "@/constants/contact";
import { BRAND_NAME } from "@/constants/brand";

type SendMailInput = {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};

let cachedTransporter: Transporter | null = null;

function getSmtpConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const port = Number(process.env.SMTP_PORT || "465");

  if (!host || !user || !pass) {
    return null;
  }

  const secure =
    process.env.SMTP_SECURE === "true" ||
    process.env.SMTP_SECURE === "1" ||
    port === 465;

  return {
    host,
    port,
    secure,
    user,
    pass,
    from:
      process.env.SMTP_FROM?.trim() ||
      `"${BRAND_NAME}" <${user}>`,
    notifyTo:
      process.env.SMTP_NOTIFY_TO?.trim() || BRAND_CONTACT.email,
  };
}

export function isEmailConfigured(): boolean {
  return getSmtpConfig() !== null;
}

function getTransporter(): Transporter | null {
  const config = getSmtpConfig();
  if (!config) return null;

  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
  }

  return cachedTransporter;
}

export async function sendMail(
  input: SendMailInput,
): Promise<{ sent: true } | { sent: false; reason: string }> {
  const config = getSmtpConfig();
  const transporter = getTransporter();

  if (!config || !transporter) {
    return {
      sent: false,
      reason: "SMTP is not configured (SMTP_HOST / SMTP_USER / SMTP_PASS).",
    };
  }

  try {
    await transporter.sendMail({
      from: config.from,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
      replyTo: input.replyTo,
    });
    return { sent: true };
  } catch (error) {
    console.error("sendMail error:", error);
    return {
      sent: false,
      reason: error instanceof Error ? error.message : "Failed to send email.",
    };
  }
}

export function getNotifyEmail(): string {
  return getSmtpConfig()?.notifyTo ?? BRAND_CONTACT.email;
}
