import * as Queue from 'bull';

export const EMAIL_NOTIFICATION = 'EMAIL_NOTIFICATION';

export default {
  [EMAIL_NOTIFICATION]: new Queue(EMAIL_NOTIFICATION),
};
