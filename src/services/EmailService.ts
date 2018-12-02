import { Transporter, SendMailOptions, createTransport } from 'nodemailer';
import * as mailGunTransport from 'nodemailer-mailgun-transport';
import { head } from 'lodash';
import * as path from 'path';
import { renderFile, LocalsObject } from 'pug';

import config from '@app/config';

export interface IMailOptions extends SendMailOptions {
  filename: string;
  isActionRequired?: boolean;
}

class EmailService {
  private static subjectPrefix(isActionRequired: boolean): string {
    const prefixes: { [key: string]: boolean } = {
      ['[Action required] ']: isActionRequired,
    };

    return head(Object.keys(prefixes).filter(prefix => prefixes[prefix])) || '';
  }

  private static extendOptions({
    isActionRequired,
    ...restOptions
  }: IMailOptions): SendMailOptions {
    return {
      ...restOptions,
      subject: `${EmailService.subjectPrefix(isActionRequired)}${restOptions.subject}`,
    };
  }

  private sender: string;
  private transporter: Transporter;
  private viewsPath: string;

  constructor() {
    this.sender = `Node Rune Server <info@${config.get('/mailgun/domain')}>`;
    this.transporter = createTransport(mailGunTransport({ auth: config.get('/mailgun') }));
    this.viewsPath = path.resolve(__dirname, 'views', 'emails');
  }

  public async send(options: IMailOptions, locals: LocalsObject = {}) {
    try {
      const html = await renderFile(`.${this.viewsPath}/${options.filename}`, locals);

      if (!html) throw new Error('Email template rendering error');

      return this.transporter.sendMail({
        from: this.sender,
        html,
        ...EmailService.extendOptions(options),
      });
    } catch (e) {
      throw e;
    }
  }
}

export default new EmailService();
