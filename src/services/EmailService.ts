import { Transporter, SendMailOptions, createTransport } from 'nodemailer';
import * as mailGunTransport from 'nodemailer-mailgun-transport';

import config from '@app/config';

class EmailService {
  private sender: string;
  private transporter: Transporter;

  constructor() {
    this.sender = 'Node Rune Server <info@mailer.00noderune.com>';
    this.transporter = createTransport(mailGunTransport({ auth: config.get('/mailgun') }));
  }

  public send(options: SendMailOptions) {
    return this.transporter.sendMail({
      from: this.sender,
      ...options,
    });
  }
}

export default new EmailService();
