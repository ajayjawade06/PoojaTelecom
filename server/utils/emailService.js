import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (toEmail, name, code) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email configuration missing in .env. Please check EMAIL_USER and EMAIL_PASS.');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Pooja Telecom" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Your Verification Code: ${code}`,
    html: `
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
        <p style="color: #9ca3af; font-size: 13px;">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
        <p style="color: #9ca3af; font-size: 13px;">If you did not create an account, you can safely ignore this email.</p>
      </div>
      <div style="background: #f3f4f6; padding: 16px; text-align: center;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Pooja Telecom. All rights reserved.</p>
      </div>
    </div>
    `,
  });
};
