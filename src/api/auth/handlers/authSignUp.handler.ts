import { Request, Response } from 'express';
import * as jsonwebtoken from 'jsonwebtoken';

import { User } from '@app/models';
import config from '@app/config';
import { emailService } from '@app/services';

class AuthSignUpHandler {
  public async route(req: Request, res: Response) {
    const { firstName, lastName, email, password } = req.body;
    const user = { firstName, lastName, email };

    try {
      const verificationToken = jsonwebtoken.sign(
        user,
        config.get('/auth/verificationTokenSecret'),
        { expiresIn: config.get('/auth/verificationTokenExpiresIn') },
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
          activationLink: plainUser.verificationToken,
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
