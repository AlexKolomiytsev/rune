import { Job } from 'bull';
import { EMAIL_NOTIFICATION } from './queues';
import { logger } from '@app/services';

export const processorsInitializers = {
  [EMAIL_NOTIFICATION]: (job: Job) => {
    logger.info(EMAIL_NOTIFICATION, job);
  },
};
