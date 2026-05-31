import { buildEmailTemplate } from './email-template.js';
import dayjs from 'dayjs';
import { transporter, accountEmail } from '../config/nodemailer.js';

export const sendReminderEmail = async ({ to, type, subscription }) => {
    if (!to || !type) throw new Error('Missing required parameters');

    // Extract the day number from the type (e.g. "reminder_7 days_before" -> 7)
    // If not found, defaults to 7
    const match = type.match(/\d+/);
    const workflowDay = match ? parseInt(match[0], 10) : 7;

    const templateResult = buildEmailTemplate({
        workflowDay: workflowDay,
        customerName: subscription.user.name,
        planName: subscription.name,
        renewalDate: subscription.renewalDate,
        amount: subscription.price,
        currency: subscription.currency || 'IDR', // defaults to IDR per your model
    });

    const mailOptions = {
        from: accountEmail,
        to: to,
        subject: templateResult.subject,
        html: templateResult.html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) return console.error('Error sending email:', error);
        console.log('Email sent:', info.response);
    });
};