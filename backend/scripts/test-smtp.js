// Standalone SMTP test script. Run without starting the full server.
// Usage: node backend/scripts/test-smtp.js recipient@example.com

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { sendEmail, isSmtpConfigured } from '../utils/email.js';

// Get script directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load backend .env with override (always reload fresh values)
dotenv.config({ path: join(__dirname, '..', '.env'), override: true });

async function main(){
  const to = process.argv[2] || process.env.TEST_EMAIL_TO;
  if (!to){
    console.error('Usage: node scripts/test-smtp.js recipient@example.com');
    process.exit(2);
  }

  console.log('SMTP configured?', isSmtpConfigured());
  
  // Debug: show actual SMTP config being used
  console.log('\n=== SMTP Config ===');
  console.log('Host:', process.env.SMTP_HOST);
  console.log('Port:', process.env.SMTP_PORT);
  console.log('User:', process.env.SMTP_USER);
  console.log('Pass:', process.env.SMTP_PASS ? '***' + process.env.SMTP_PASS.slice(-4) : '(not set)');
  console.log('===================\n');
  
  try {
    const info = await sendEmail({ to, subject: 'SGP SMTP test', text: 'This is a test email from the SGP backend (test-smtp.js)' });
    console.log('sendEmail success:', info && info.messageId ? info.messageId : info);
    process.exit(0);
  } catch (err) {
    console.error('sendEmail failed:', err && err.message ? err.message : err);
    process.exit(1);
  }
}

main();
