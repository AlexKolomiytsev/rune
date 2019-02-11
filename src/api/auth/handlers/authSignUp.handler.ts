import { Request, Response } from 'express';
import * as jsonwebtoken from 'jsonwebtoken';

import { User } from '@app/models';
import config from '@app/utils/config';
import { MailTypes } from '@app/utils/constants';
import queues, { EMAIL_NOTIFICATION } from '@app/workers/queues';

const { url } = config.get('/server');
const { prefix } = config.get('/views');
const verificationTokenExpiresIn = config.get('/auth/verificationTokenExpiresIn');
const viewsRoot = `${url}/${prefix}/auth/verify-email`;

class AuthSignUpHandler {
  constructor() {
    this.route = this.route.bind(this);
  }

  public async route(req: Request, res: Response) {
    const { firstName, lastName, email, password } = req.body;
    const user = { firstName, lastName, email };

    try {
      const verificationToken = jsonwebtoken.sign(
        user,
        config.get('/auth/verificationTokenSecret'),
        { expiresIn: verificationTokenExpiresIn },
      );

      const createdUser: any = await User.create({ ...user, password, verificationToken });
      const plainUser = createdUser.toObject();

      queues[EMAIL_NOTIFICATION].add({
        mailType: MailTypes.EmailVerification,
        options: {
          to: plainUser.email,
        },
        locals: {
          activationLink: `${viewsRoot}/${plainUser.verificationToken}`,
        },
      });

      delete plainUser.verificationToken;
      delete plainUser.password;

      return res.message('An activation link has been sent to your email.').reply({
        ...plainUser,
      });
    } catch (e) {
      return res.reply(e);
    }
  }
}

export default new AuthSignUpHandler();
