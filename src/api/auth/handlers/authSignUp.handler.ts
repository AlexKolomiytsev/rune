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
      await emailService.send({
        to: plainUser.email,
        subject: '[Action required] Verify your email address to sign up in the Node Rune system.',
        text: `Just use for now this code to verify your email: ${plainUser.verificationToken}`,
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
