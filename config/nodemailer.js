import nodemailer from 'nodemailer';
import { EMAIL_PASS } from './env.js';


export const accountEmail = 'rizkiahmad7396@gmail.com';
export const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: accountEmail,
        pass: EMAIL_PASS
    }
});