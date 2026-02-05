import nodemailer from 'nodemailer';

export const sendMail = async (to: string | string[], subject: string, html: string) => {
    try {
        console.log('--- VERCEL MAILER DIAGNOSTICS ---');
        console.log('User detected:', !!process.env.EMAIL_USER);
        console.log('Pass detected:', !!process.env.EMAIL_PASS);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const recipients = Array.isArray(to) ? to.join(', ') : to;

        const mailOptions = {
            from: `no-reply <${process.env.EMAIL_USER}>`,
            to: recipients,
            subject: subject,
            html: html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error('Error sending email:', error);
        return {
            success: false,
            error: error.message || "Failed to send email"
        };
    }
};
