import { Job } from 'bull';
import { LocalsObject } from 'pug';
import { get } from 'lodash';

import { IMailOptions } from '@app/services/EmailService';
import { emailService, ILogger } from '@app/services';
import { EMAIL_NOTIFICATION } from '@app/workers/queues';
import { MailTypes, MAIL_TYPES_OPTIONS, iocTYPES } from '@app/utils/constants';
import container from '@app/inversify.config';

const logger = container.get<ILogger>(iocTYPES.Logger);

export interface ITaskOptions {
  options: Partial<IMailOptions>;
  locals: LocalsObject;
  mailType?: MailTypes;
}

export default (job: Job<ITaskOptions>): Promise<any> => {
  logger.info(
    'Starting processing',
    JSON.stringify(
      {
        queueName: EMAIL_NOTIFICATION,
        data: job.data,
      },
      null,
      2,
    ),
  );

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
};
