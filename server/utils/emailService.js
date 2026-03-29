export const sendVerificationEmail = async (toEmail, name, code) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.EMAIL_USER || 'lipashaikh005@gmail.com';

  const emailData = {
    sender: { name: 'Pooja Telecom', email: senderEmail },
    to: [{ email: toEmail, name }],
    subject: `Your Verification Code: ${code}`,
    htmlContent: `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; background: #f9fafb; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
      <div style="background: linear-gradient(135deg, #1e293b, #065f46); padding: 32px; text-align: center;">
        <h1 style="color: white; font-size: 24px; margin: 0;">Pooja Telecom</h1>
        <p style="color: #a7f3d0; margin: 8px 0 0;">Email Verification</p>
      </div>
      <div style="padding: 32px;">
        <p style="color: #374151; font-size: 16px;">Hi <strong>${name}</strong>,</p>
        <p style="color: #6b7280;">Thanks for registering! Please enter the verification code below to activate your account.</p>
        <div style="background: #ecfdf5; border: 2px dashed #10b981; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
          <p style="margin: 0 0 8px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Your OTP Code</p>
          <p style="margin: 0; font-size: 42px; font-weight: 900; letter-spacing: 12px; color: #065f46;">${code}</p>
        </div>
        <p style="color: #9ca3af; font-size: 13px;">This code expires in <strong>5 minutes</strong>. Do not share it with anyone.</p>
        <p style="color: #9ca3af; font-size: 13px;">If you did not create an account, you can safely ignore this email.</p>
      </div>
      <div style="background: #f3f4f6; padding: 16px; text-align: center;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Pooja Telecom. All rights reserved.</p>
      </div>
    </div>
    `,
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Brevo API Error Details:', JSON.stringify(data, null, 2));
      throw new Error(data.message || 'Failed to send transactional email via Brevo');
    }

    console.log('Verification email sent successfully:', data.messageId);
    return data;
  } catch (error) {
    console.error('Email send error:', error.message);
    throw error;
  }
};

export const sendResetPasswordEmail = async (toEmail, name, code) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.EMAIL_USER || 'lipashaikh005@gmail.com';

  const emailData = {
    sender: { name: 'Pooja Telecom', email: senderEmail },
    to: [{ email: toEmail, name }],
    subject: `Password Reset Code: ${code}`,
    htmlContent: `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; background: #f9fafb; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
      <div style="background: linear-gradient(135deg, #1e293b, #065f46); padding: 32px; text-align: center;">
        <h1 style="color: white; font-size: 24px; margin: 0;">Pooja Telecom</h1>
        <p style="color: #a7f3d0; margin: 8px 0 0;">Password Recovery</p>
      </div>
      <div style="padding: 32px;">
        <p style="color: #374151; font-size: 16px;">Hi <strong>${name}</strong>,</p>
        <p style="color: #6b7280;">You requested to reset your password. Use the code below to complete the process.</p>
        <div style="background: #ecfdf5; border: 2px dashed #10b981; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
          <p style="margin: 0 0 8px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Your Reset Code</p>
          <p style="margin: 0; font-size: 42px; font-weight: 900; letter-spacing: 12px; color: #065f46;">${code}</p>
        </div>
        <p style="color: #9ca3af; font-size: 13px;">This code expires in <strong>5 minutes</strong>. If you did not request a reset, please ignore this email.</p>
      </div>
      <div style="background: #f3f4f6; padding: 16px; text-align: center;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Pooja Telecom. All rights reserved.</p>
      </div>
    </div>
    `,
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Brevo API Error Details:', JSON.stringify(data, null, 2));
      throw new Error(data.message || 'Failed to send transactional email via Brevo');
    }

    console.log('Reset password email sent successfully:', data.messageId);
    return data;
  } catch (error) {
    console.error('Email send error:', error.message);
    throw error;
  }
};
