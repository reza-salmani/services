import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailerService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env['ADMIN_EMAIL'],
        pass: process.env['ADMIN_EMAIL_PASSWORD'],
      },
    });
  }
  async sendMail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: process.env['ADMIN_EMAIL'],
      to,
      subject,
      text,
    };
    return await this.transporter.sendMail(mailOptions);
  }
}
