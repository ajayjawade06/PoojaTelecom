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

export const sendOrderConfirmationEmail = async (order, user) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.EMAIL_USER || 'lipashaikh005@gmail.com';

  const orderItemsHtml = order.orderItems.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <div style="font-weight: bold; color: #374151;">${item.name}</div>
        <div style="font-size: 12px; color: #6b7280;">Qty: ${item.qty}</div>
      </td>
      <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb; color: #374151;">
        ₹${item.price.toLocaleString()}
      </td>
    </tr>
  `).join('');

  const emailData = {
    sender: { name: 'Pooja Telecom', email: senderEmail },
    to: [{ email: user.email, name: user.name }],
    subject: `Order Confirmed - #${order._id.toString().slice(-6).toUpperCase()}`,
    htmlContent: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #1e293b, #2563eb); padding: 40px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em;">Order Confirmed!</h1>
        <p style="margin: 10px 0 0; opacity: 0.9; font-size: 16px;">Thank you for your purchase from Pooja Telecom</p>
      </div>
      
      <div style="padding: 32px;">
        <div style="margin-bottom: 32px; padding-bottom: 16px; border-bottom: 2px solid #f3f4f6;">
          <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af; margin: 0 0 8px;">Order Summary</h2>
          <p style="font-size: 18px; font-weight: bold; color: #1f2937; margin: 0;">Order #${order._id.toString().slice(-6).toUpperCase()}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 12px; font-size: 12px; text-transform: uppercase; color: #9ca3af; border-bottom: 1px solid #e5e7eb;">Items</th>
              <th style="text-align: right; padding: 12px; font-size: 12px; text-transform: uppercase; color: #9ca3af; border-bottom: 1px solid #e5e7eb;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${orderItemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td style="padding: 12px; font-weight: bold; color: #1f2937;">Total Amount</td>
              <td style="padding: 12px; text-align: right; font-size: 20px; font-weight: 900; color: #2563eb;">₹${order.totalPrice.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>

        <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
          <h3 style="font-size: 14px; font-weight: bold; color: #1f2937; margin: 0 0 12px;">Shipping Address</h3>
          <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
            ${user.name}<br>
            ${order.shippingAddress.address}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
            ${order.shippingAddress.country}
          </p>
        </div>

        <div style="text-align: center;">
          <p style="color: #6b7280; font-size: 14px; margin-bottom: 24px;">We'll send another update when your order ships!</p>
          <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/track-order/${order._id}" style="display: inline-block; background: #2563eb; color: white; padding: 14px 28px; border-radius: 9999px; text-decoration: none; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">Track Your Order</a>
        </div>
      </div>

      <div style="background: #f3f4f6; padding: 24px; text-align: center;">
        <p style="margin: 0; color: #9ca3af; font-size: 12px;">&copy; ${new Date().getFullYear()} Pooja Telecom. All rights reserved.</p>
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
    if (!response.ok) throw new Error(data.message || 'Failed to send confirmation email');
    console.log('Order confirmation email sent:', data.messageId);
    return data;
  } catch (error) {
    console.error('Order email error:', error.message);
  }
};

export const sendOrderSms = async (order, phoneNumber) => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return;

  const smsData = {
    sender: 'POOJATEL', // Use registered Sender ID if available
    recipient: phoneNumber,
    content: `Hi! Your order #${order._id.toString().slice(-6).toUpperCase()} from Pooja Telecom for ₹${order.totalPrice.toLocaleString()} has been placed successfully! Tracking: ${process.env.CLIENT_URL || 'http://localhost:3000'}/track-order/${order._id}`,
    type: 'transactional'
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/transactionalSMS/sms', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(smsData),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Brevo SMS API Error:', JSON.stringify(data, null, 2));
      return;
    }

    console.log('Order SMS sent successfully');
    return data;
  } catch (error) {
    console.error('Order SMS error:', error.message);
  }
};

export const sendOrderShippedEmail = async (order, user) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.EMAIL_USER || 'lipashaikh005@gmail.com';

  const emailData = {
    sender: { name: 'Pooja Telecom', email: senderEmail },
    to: [{ email: user.email, name: user.name }],
    subject: `Order Shipped! - #${order._id.toString().slice(-6).toUpperCase()}`,
    htmlContent: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 40px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em;">On The Way!</h1>
        <p style="margin: 10px 0 0; opacity: 0.9; font-size: 16px;">Your order has been shipped and is heading to you.</p>
      </div>
      <div style="padding: 32px;">
        <div style="margin-bottom: 24px; text-align: center;">
          <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Order Number</p>
          <p style="font-size: 20px; font-weight: bold; color: #111827;">#${order._id.toString().slice(-6).toUpperCase()}</p>
        </div>
        <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 32px; border: 1px dashed #cbd5e1;">
          <h3 style="font-size: 14px; font-weight: bold; color: #1f2937; margin: 0 0 12px;">Delivery Address</h3>
          <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
            ${user.name}<br>
            ${order.shippingAddress.address}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}
          </p>
        </div>
        <div style="text-align: center;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/track-order/${order._id}" style="display: inline-block; background: #111827; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px;">Track Delivery Status</a>
        </div>
      </div>
      <div style="background: #f3f4f6; padding: 24px; text-align: center;">
        <p style="margin: 0; color: #9ca3af; font-size: 12px;">&copy; ${new Date().getFullYear()} Pooja Telecom. All rights reserved.</p>
      </div>
    </div>
    `,
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'accept': 'application/json', 'api-key': apiKey, 'content-type': 'application/json' },
      body: JSON.stringify(emailData),
    });
    const data = await response.json();
    console.log('Order shipped email sent:', data.messageId);
  } catch (error) {
    console.error('Shipped email error:', error.message);
  }
};

export const sendOrderDeliveredEmail = async (order, user) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.EMAIL_USER || 'lipashaikh005@gmail.com';

  const emailData = {
    sender: { name: 'Pooja Telecom', email: senderEmail },
    to: [{ email: user.email, name: user.name }],
    subject: `Delivered! - #${order._id.toString().slice(-6).toUpperCase()}`,
    htmlContent: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 40px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em;">Order Delivered!</h1>
        <p style="margin: 10px 0 0; opacity: 0.9; font-size: 16px;">We hope you are enjoying your new items.</p>
      </div>
      <div style="padding: 32px; text-align: center;">
        <p style="color: #374151; font-size: 16px; margin-bottom: 24px;">Your order <strong>#${order._id.toString().slice(-6).toUpperCase()}</strong> has been successfully delivered.</p>
        <div style="margin-bottom: 32px;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/track-order/${order._id}" style="display: inline-block; background: #059669; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px;">View Order Details</a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">If you have any issues with your delivery, please contact our support team immediately.</p>
      </div>
      <div style="background: #f3f4f6; padding: 24px; text-align: center;">
        <p style="margin: 0; color: #9ca3af; font-size: 12px;">&copy; ${new Date().getFullYear()} Pooja Telecom. All rights reserved.</p>
      </div>
    </div>
    `,
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'accept': 'application/json', 'api-key': apiKey, 'content-type': 'application/json' },
      body: JSON.stringify(emailData),
    });
    const data = await response.json();
    console.log('Order delivered email sent:', data.messageId);
  } catch (error) {
    console.error('Delivered email error:', error.message);
  }
};

export const sendOrderRefundedEmail = async (order, user) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.EMAIL_USER || 'lipashaikh005@gmail.com';

  const emailData = {
    sender: { name: 'Pooja Telecom', email: senderEmail },
    to: [{ email: user.email, name: user.name }],
    subject: `Refund Processed - #${order._id.toString().slice(-6).toUpperCase()}`,
    htmlContent: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
      <div style="background: #1f2937; padding: 40px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em;">Refund Confirmed</h1>
        <p style="margin: 10px 0 0; opacity: 0.9; font-size: 16px;">We have processed your refund request.</p>
      </div>
      <div style="padding: 32px;">
        <div style="background: #fff7ed; border: 1px solid #ffedd5; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <p style="margin: 0; color: #9a3412; font-size: 14px; line-height: 1.6;">
            A refund of <strong>₹${order.totalPrice.toLocaleString()}</strong> for order <strong>#${order._id.toString().slice(-6).toUpperCase()}</strong> has been initiated. It may take 5-7 business days to reflect in your original payment method.
          </p>
        </div>
        <div style="text-align: center;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/track-order/${order._id}" style="display: inline-block; color: #2563eb; font-weight: bold; text-decoration: none; font-size: 14px;">View Updated Order Status</a>
        </div>
      </div>
      <div style="background: #f3f4f6; padding: 24px; text-align: center;">
        <p style="margin: 0; color: #9ca3af; font-size: 12px;">&copy; ${new Date().getFullYear()} Pooja Telecom. All rights reserved.</p>
      </div>
    </div>
    `,
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'accept': 'application/json', 'api-key': apiKey, 'content-type': 'application/json' },
      body: JSON.stringify(emailData),
    });
    const data = await response.json();
    console.log('Order refunded email sent:', data.messageId);
  } catch (error) {
    console.error('Refund email error:', error.message);
  }
};

export const sendStatusUpdateSms = async (order, phoneNumber, status) => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return;

  let content = '';
  const orderId = order._id.toString().slice(-6).toUpperCase();
  const trackUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/track-order/${order._id}`;

  switch (status) {
    case 'shipped':
      content = `Great news! Your Pooja Telecom order #${orderId} has been shipped. Track it here: ${trackUrl}`;
      break;
    case 'delivered':
      content = `Your order #${orderId} from Pooja Telecom has been delivered. We hope you love it! Details: ${trackUrl}`;
      break;
    case 'refunded':
      content = `A refund for your Pooja Telecom order #${orderId} has been processed. The amount will reflect in your account soon. Details: ${trackUrl}`;
      break;
    default:
      return;
  }

  const smsData = {
    sender: 'POOJATEL',
    recipient: phoneNumber,
    content,
    type: 'transactional'
  };

  try {
    await fetch('https://api.brevo.com/v3/transactionalSMS/sms', {
      method: 'POST',
      headers: { 'accept': 'application/json', 'api-key': apiKey, 'content-type': 'application/json' },
      body: JSON.stringify(smsData),
    });
    console.log(`Order ${status} SMS sent`);
  } catch (error) {
    console.error(`Status update SMS error (${status}):`, error.message);
  }
};
