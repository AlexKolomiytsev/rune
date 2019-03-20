import * as mailGunTransport from 'nodemailer-mailgun-transport';
import * as path from 'path';
import { Transporter, SendMailOptions, createTransport, SentMessageInfo } from 'nodemailer';
import { renderFile, LocalsObject } from 'pug';

import config from '@app/utils/config';
import { injectable } from 'inversify';

export interface IMailOptions extends SendMailOptions {
  filename: string;
  isActionRequired?: boolean;
}

export interface IEmailService {
  send(options: IMailOptions, locals: LocalsObject): Promise<SentMessageInfo>;
}

@injectable()
export default class EmailService implements IEmailService {
  private static subjectPrefix(isActionRequired: boolean): string {
    const prefixes: { [key: string]: boolean } = {
      ['[Action required] ']: isActionRequired,
    };

    return (
      Object.keys(prefixes)
        .filter(prefix => prefixes[prefix])
        .join('') || ''
    );
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
    this.sender = `Node Rune Server <no-reply@${config.get('/mailgun/domain')}>`;
    this.transporter = createTransport(mailGunTransport({ auth: config.get('/mailgun') }));
    this.viewsPath = path.resolve(__dirname, 'views', 'emails');
  }

  public async send(options: IMailOptions, locals: LocalsObject): Promise<SentMessageInfo> {
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
