import { Job } from 'bull';
import { LocalsObject } from 'pug';
import { get } from 'lodash';

import { IMailOptions } from '@app/services/EmailService';
import { emailService, logger } from '@app/services';
import { EMAIL_NOTIFICATION } from '@app/workers/queues';
import { MailTypes, MAIL_TYPES_OPTIONS } from '@app/utils/constants';

export default (
  job: Job<{ options: IMailOptions; locals: LocalsObject; mailType?: MailTypes }>,
): Promise<any> => {
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
      ...get(predefinedData, 'options', {}),
      ...options,
    },
    {
      ...get(predefinedData, 'locals', {}),
      ...locals,
    },
  );
};
