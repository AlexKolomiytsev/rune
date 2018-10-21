import { Request, Response } from 'express';
import * as jsonwebtoken from 'jsonwebtoken';

import { User } from '@app/models';
import config from '@app/config';

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

      delete plainUser.verificationToken;
      delete plainUser.password;
      // TODO: send an email with verification link
      return res.message('An activation link has been sent to your email.').reply({
        ...plainUser,
      });
    } catch (e) {
      return res.reply(e);
    }
  }
}

export default new AuthSignUpHandler();
