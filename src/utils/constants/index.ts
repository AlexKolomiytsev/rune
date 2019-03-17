export { default as iocTYPES } from './iocTYPES';

export enum MailTypes {
  EmailVerification,
}

export const MAIL_TYPES_OPTIONS: { [key: string]: { options: object; locals: object } } = {
  [MailTypes.EmailVerification]: {
    options: {
      filename: 'authVerifyEmail.pug',
      subject: 'Verify your email address to sign up in the Node Rune system.',
      isActionRequired: true,
    },
    locals: {
      headerTitle: 'Please verify your Rune account',
    },
  },
};
