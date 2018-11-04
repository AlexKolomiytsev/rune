import { Request, Response } from 'express';
import { authSignUpFinishHandler } from '@app/api/auth/handlers';

class AuthVerifyEmailHandler {
  public async route(req: Request, res: Response) {
    const { verificationToken } = req.params;

    try {
      const verifiedUser = await authSignUpFinishHandler.verify(verificationToken);

      res.render('auth/verifyEmail', {
        title: 'Hey',
        headerTitle: `Hi, ${verifiedUser.firstName}`,
        message: `Your account has been successfully verified. Now you can log in.`,
      });
    } catch (e) {
      res.render('auth/verifyEmail', {
        title: 'Error',
        headerTitle: 'There was an error verifying your email',
        message: e.message,
      });
    }
  }
}

export default new AuthVerifyEmailHandler();
