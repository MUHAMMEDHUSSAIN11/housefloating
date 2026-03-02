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

        // Send emails in parallel to avoid timeouts and sequential delays
        const emailPromises = [
            sendAdminEmail(bookingData, adminEmails),
            sendOwnerEmail(bookingData)
        ];

        if (bookingData.guestEmail) {
            emailPromises.push(sendUserEmail(bookingData));
        }

        await Promise.all(emailPromises);

        return { success: true };
    } catch (error) {
        console.error('Error in sendAllEmails:', error);
        return { success: false, error: 'Failed to send emails' };
    }
}
