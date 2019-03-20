import { inject, injectable } from 'inversify';
import { Job } from 'bull';
import { iocTYPES } from '@app/utils/constants';
import { IEmailNotificationJobProcessor } from '@app/workers/processors/EmailNotificationJobProcessor';

import { EMAIL_NOTIFICATION } from '@app/workers/queues';

export interface IProcessorInitializers {
  map: { [key: string]: (job: Job<any>) => Promise<any> };
}

@injectable()
export default class ProcessorInitializers implements IProcessorInitializers {
  @inject(iocTYPES.EmailNotificationJobProcessor)
  private readonly _emailNotification: IEmailNotificationJobProcessor;

  get map(): { [key: string]: (job: Job<any>) => Promise<any> } {
    return {
      [EMAIL_NOTIFICATION]: this._emailNotification.process,
    };
  }
}
