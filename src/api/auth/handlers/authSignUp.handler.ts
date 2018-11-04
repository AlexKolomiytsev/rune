import { Request, Response } from 'express';
import * as jsonwebtoken from 'jsonwebtoken';

import { User } from '@app/models';
import config from '@app/config';
import { emailService } from '@app/services';

const { host, port } = config.get('/server');
const { prefix } = config.get('/views');
const verificationTokenExpiresIn = config.get('/auth/verificationTokenExpiresIn');

const viewsRoot = `http://${host}:${port}/${prefix}/auth/verify-email`;

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

      // TODO: dispatch email notification by Bull job scheduler
      // TODO: create templates
      await emailService.send(
        {
          filename: 'authVerifyEmail.pug',
          to: plainUser.email,
          subject: 'Verify your email address to sign up in the Node Rune system.',
          isActionRequired: true,
        },
        {
          headerTitle: 'Please verify your Rune account',
          activationLink: `${viewsRoot}/${plainUser.verificationToken}`,
        },
      );

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
