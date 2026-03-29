import { Resend } from 'resend';

const resend = new Resend('re_51oRQVZN_2sZrJqwK2PzG5kj9yLjcvg7t');

async function testEmail() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'lipashaikh005@gmail.com',
      subject: 'Test Email from Pooja Telecom',
      html: '<p>Testing Resend API key</p>'
    });
    console.log('Data:', data);
    console.log('Error:', error);
  } catch (err) {
    console.error('Exception:', err);
  }
}

testEmail();
