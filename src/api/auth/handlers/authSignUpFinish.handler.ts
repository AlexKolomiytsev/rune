import { Request, Response } from 'express';
import * as boom from 'boom';

import config from '@app/utils/config';
import { verifyJwt } from '@app/utils/helpers';
import { User } from '@app/models';

class AuthSignUpFinishHandler {
  private verificationTokenSecret: string;

  constructor() {
    this.verificationTokenSecret = config.get('/auth/verificationTokenSecret');
    this.route = this.route.bind(this);
  }

  public async route(req: Request, res: Response) {
    const { verificationToken } = req.params;

    try {
      const verifiedUser = await this.verify(verificationToken);

      const plainUser = verifiedUser.toObject();
      delete plainUser.password;

      res.message('User successfully verified').reply(plainUser);
    } catch (e) {
      res.reply(e);
    }
  }

  public async verify(verificationToken: string) {
    const { email } = await verifyJwt(verificationToken, this.verificationTokenSecret);

    const user = await User.findOne({ email });

    if (!user) throw boom.notFound('User does not exist', { email });
    if (user.isVerified) throw boom.badRequest('User is already verified', { email });

    user.isVerified = true;
    user.verificationToken = null;

    return await user.save();
  }
}

export default new AuthSignUpFinishHandler();
