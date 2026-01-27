'use server'

import { sendAdminEmail } from './adminemailsender';
import { sendUserEmail } from './useremailsender';
import { sendOwnerEmail } from './owneremailsender';
import fs from 'fs';
import path from 'path';

export async function sendAllEmails(bookingData: any) {
    try {
        // Load admin emails from JSON
        const dataPath = path.join(process.cwd(), 'src', 'data', 'adminsEmail.json');
        const fileContents = fs.readFileSync(dataPath, 'utf8');
        const adminData = JSON.parse(fileContents);
        const adminEmails = adminData.emails || [];

        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        // Send emails sequentially with a small delay to avoid rate limits (2 req/sec)
        await sendAdminEmail(bookingData, adminEmails);
        await delay(500);
        await sendOwnerEmail(bookingData);

        if (bookingData.guestEmail) {
            await delay(500);
            await sendUserEmail(bookingData);
        }

        return { success: true };
    } catch (error) {
        console.error('Error in sendAllEmails:', error);
        return { success: false, error: 'Failed to send emails' };
    }
}
