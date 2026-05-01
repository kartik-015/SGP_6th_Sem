import nodemailer from "nodemailer";
import dotenv from 'dotenv';
import fs from 'fs';

function createTransporterFromEnv() {
  const smtpHost = process.env.SMTP_HOST || process.env.EMAIL_HOST || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587);
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER || "";
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || "";

  const transportOpts = {
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    requireTLS: smtpPort === 587,
  };
  if (smtpUser && smtpPass) transportOpts.auth = { user: smtpUser, pass: smtpPass };

  return { transporter: nodemailer.createTransport(transportOpts), smtpUser, smtpPass };
}

let cached = createTransporterFromEnv();
let lastVerifyError = null;

async function ensureTransporterReady() {
  // Reload .env from backend folder to pick up any changes made on disk
  try {
    dotenv.config({ path: './.env', override: true });
  } catch (e) {}
  
  // ALWAYS recreate transporter with fresh env values after reload
  cached = createTransporterFromEnv();
  
  // Try verify; if fails due to auth/network, return false
  try {
    await cached.transporter.verify();
    return true;
  } catch (err) {
    const msg = err && err.message ? err.message : String(err);
    lastVerifyError = msg;
    console.warn('Email transporter not ready:', msg);
    return false;
  }
}

export function isSmtpConfigured(){
  // Reload .env so we detect updated credentials on disk
  try { dotenv.config({ path: '../.env' }); } catch (e) {}
  try { dotenv.config({ path: './.env' }); } catch (e) {}
  // If env contains SMTP credentials, refresh cached transporter so callers can send immediately
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try { cached = createTransporterFromEnv(); } catch (e) {}
    return true;
  }
  return false;
}

export async function sendEmail({ to, subject, html, text, from }) {
  const sender = from || process.env.MAIL_FROM || (cached && cached.smtpUser) || "no-reply@example.com";

  // Debug: log SMTP config being used
  console.log('=== sendEmail Debug ===');
  console.log('SMTP_HOST:', process.env.SMTP_HOST);
  console.log('SMTP_USER:', process.env.SMTP_USER);
  console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***' + process.env.SMTP_PASS.slice(-4) : 'NOT SET');
  console.log('MAIL_FROM:', process.env.MAIL_FROM);
  console.log('Sender (from):', sender);
  console.log('======================');

  const ready = await ensureTransporterReady();
  if (!ready) {
    const errMsg = lastVerifyError ? `SMTP transporter not ready or authentication failed: ${lastVerifyError}` : 'SMTP transporter not ready or authentication failed';
    const err = new Error(errMsg);
    console.error('sendEmail failed:', err.message);
    throw err;
  }

  try {
    const info = await cached.transporter.sendMail({ from: sender, to, subject, html, text });
    return info;
  } catch (err) {
    console.error('sendEmail failed:', err && err.message ? err.message : err);
    throw err;
  }
}

// Expose last verify error for diagnostics
export function getLastEmailVerifyError() {
  return lastVerifyError;
}
