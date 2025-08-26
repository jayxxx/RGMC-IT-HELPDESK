import nodemailer from 'nodemailer';

export function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: String(process.env.EMAIL_SECURE) === 'true',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
}

const FRONTEND_URL = process.env.FRONTEND_URL;

export function getTrackingLink(ticketID, email) {
  return `${FRONTEND_URL}/track?ticketID=${encodeURIComponent(ticketID)}&email=${encodeURIComponent(email)}`;
}

export function getAdminTicketLink(ticket) {
  return `${process.env.NEXT_PUBLIC_BASE_URL}/ticket/${ticket._id}`;
}
