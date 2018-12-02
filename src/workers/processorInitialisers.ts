import { Job } from 'bull';
import { EMAIL_NOTIFICATION } from './queues';
import { emailNotification } from './processors';

const processorInitialisers: { [key: string]: (job: Job<any>) => Promise<any> } = {
  [EMAIL_NOTIFICATION]: emailNotification,
};

export default processorInitialisers;
