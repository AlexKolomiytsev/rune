import { Request, Response } from 'express';
import * as boom from 'boom';

import config from '@app/config';
import { verifyJwt } from '@app/helpers';
import { User } from '@app/models';

class AuthSignUpFinishHandler {
  public async route(req: Request, res: Response) {
    const { verificationToken } = req.params;

    try {
      const { email } = await verifyJwt(
        verificationToken,
        config.get('/auth/verificationTokenSecret'),
      );

      const user = await User.findOne({ email });

      if (!user) throw boom.badRequest('User does not exists', { email });

      user.isVerified = true;
      user.verificationToken = null;

      const verifiedUser = await user.save();

      res.message('User successfully verified').reply(verifiedUser);
    } catch (e) {
      res.reply(e);
    }
  }
}

export default new AuthSignUpFinishHandler();
