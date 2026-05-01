import nodemailer from 'nodemailer';

async function testEthereal() {
  try {
    // Create a temporary test account
    console.log('Creating Ethereal test account...');
    const testAccount = await nodemailer.createTestAccount();
    
    console.log('\n=== Ethereal Test Account Created ===');
    console.log('SMTP_HOST=smtp.ethereal.email');
    console.log('SMTP_PORT=587');
    console.log(`SMTP_USER=${testAccount.user}`);
    console.log(`SMTP_PASS=${testAccount.pass}`);
    console.log('=====================================\n');

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // Verify connection
    await transporter.verify();
    console.log('✓ Ethereal SMTP connection verified');

    // Send test email
    const info = await transporter.sendMail({
      from: '"Test Sender" <test@example.com>',
      to: 'recipient@example.com',
      subject: 'Equipment Approval Test',
      text: 'This is a test email for counsellor approval workflow',
      html: '<b>This is a test email for counsellor approval workflow</b>',
    });

    console.log('\n✓ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('\nPreview URL:', nodemailer.getTestMessageUrl(info));
    console.log('\n(Open the preview URL in browser to see the email)');

  } catch (error) {
    console.error('✗ Test failed:', error.message);
    process.exit(1);
  }
}

testEthereal();
