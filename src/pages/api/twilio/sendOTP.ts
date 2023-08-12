//need to modify this
import { Twilio } from 'twilio';

export default async function handler(req:any, res:any) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  try {
    const client = new Twilio(accountSid, authToken);
    client.verify.v2.services('VAa3973a4d1086b619bcf81ef342722773')
      .verifications
      .create({ to: '+919497252368', channel: 'sms' })
      .then(verification => {res.json({ verificationSid: verification.sid });})
      .catch(error => {
        console.error('Error creating verification:', error);
        res.status(500).json({ error: 'An error occurred' });
      });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
  
}
