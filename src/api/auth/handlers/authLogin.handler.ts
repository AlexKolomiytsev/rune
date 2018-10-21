import { Request, Response } from 'express';
import * as boom from 'boom';
import * as jsonwebtoken from 'jsonwebtoken';

import { User } from '@app/models';
import config from '@app/config';

class AuthLoginHandler {
  public async route(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) throw boom.badRequest('User with such email does not exist');

      const isPasswordsMatched = await user.comparePasswords(password);

      if (!isPasswordsMatched) throw boom.unauthorized('Bad credentials');

      const accessToken = jsonwebtoken.sign(
        user.toObject(),
        config.get('/auth/accessTokenSecret'),
        { expiresIn: config.get('/auth/accessTokenExpiresIn') },
      );

      return res.reply({
        accessToken,
      });
    } catch (e) {
      res.reply(e);
    }
  }
}

export default new AuthLoginHandler();
