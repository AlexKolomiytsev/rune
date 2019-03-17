import { injectable } from 'inversify';
import queues, { IQueues, EMAIL_NOTIFICATION } from '@app/workers/queues';
import { MailTypes } from '@app/utils/constants';
import config from '@app/utils/config';
import { ITaskOptions } from '@app/workers/processors/emailNotification';

const { url } = config.get('/server');
const apiPrefix = config.get('/api/prefix');
const viewsRoot = `${url}${apiPrefix}/auth/view/sign-up/finish`;

export interface IQueueService {
  scheduleUserVerificationEmail(to: string, verificationToken: string): void;
}

@injectable()
export default class QueueService implements IQueueService {
  public scheduleUserVerificationEmail(to: string, verificationToken: string) {
    this.scheduleTask(EMAIL_NOTIFICATION, {
      mailType: MailTypes.EmailVerification,
      options: { to },
      locals: {
        activationLink: `${viewsRoot}/${verificationToken}`,
      },
    });
  }

  private scheduleTask(type: keyof IQueues, options: ITaskOptions): void {
    queues[type].add(options);
  }
}
