import { injectable } from 'inversify';
import { Job } from 'bull';
import { LocalsObject } from 'pug';
import { get } from 'lodash';
import { SentMessageInfo } from 'nodemailer';

import { IEmailService, IMailOptions } from '@app/services/EmailService';
import { EMAIL_NOTIFICATION } from '@app/workers/queues';
import { MailTypes, iocTYPES, MAIL_TYPES_OPTIONS } from '@app/utils/constants';
import { IGenericJobProcessor } from '@app/types/worker';
import { bindDependencies } from '@app/utils/helpers';
import { ILogger } from '@app/services';

export interface ITaskOptions {
  options: Partial<IMailOptions>;
  locals: LocalsObject;
  mailType?: MailTypes;
}

export type IEmailNotificationJobProcessor = IGenericJobProcessor<ITaskOptions, SentMessageInfo>;

@injectable()
export default class EmailNotificationJobProcessor {
  constructor() {
    this.process = bindDependencies(this.process, [iocTYPES.Logger, iocTYPES.EmailService]);
  }

  public process(
    logger: ILogger,
    emailService: IEmailService,
    job: Job<ITaskOptions>,
  ): Promise<SentMessageInfo> {
    logger.workerProcessingStarted(EMAIL_NOTIFICATION, job.data);

    const { options, locals, mailType } = job.data;
    const predefinedData = MAIL_TYPES_OPTIONS[mailType];

    return emailService.send(
      {
        filename: '',
        ...get(predefinedData, 'options', {}),
        ...options,
      },
      {
        ...get(predefinedData, 'locals', {}),
        ...locals,
      },
    );
  }
}
