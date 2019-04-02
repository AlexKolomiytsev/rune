import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  interfaces,
  requestBody,
  requestHeaders,
  requestParam,
  response,
} from 'inversify-express-utils';
import * as boom from 'boom';
import { inject } from 'inversify';
import { Response } from 'express';
import { iocTYPES } from '@app/utils/constants';
import { IJwtService, IQueueService, IUserService } from '@app/services';
import { ISessionService } from '@app/services/SessionService';

interface ILoginPayload {
  email: string;
  password: string;
}
interface ISignUpPayload extends ILoginPayload {
  firstName: string;
  lastName: string;
}

@controller('/auth')
export default class AuthController extends BaseHttpController implements interfaces.Controller {
  @inject(iocTYPES.UserService)
  private readonly _userService: IUserService;
  @inject(iocTYPES.Jwt)
  private readonly _jwtService: IJwtService<object>;
  @inject(iocTYPES.Queue)
  private readonly _queueService: IQueueService;
  @inject(iocTYPES.SessionService)
  private readonly _sessionService: ISessionService;

  @httpPost('/login', iocTYPES.ValidationMiddleware)
  public async login(@requestBody() payload: ILoginPayload, @response() res: Response) {
    const { email, password } = payload;

    try {
      const user = await this._userService.findOne({ email });

      if (!user) throw boom.badRequest('User with such email does not exist');
      if (!user.isVerified) throw boom.forbidden('You have not yet verified your account.');

      const isPasswordMatched = await this._userService.isPasswordMatched(user, password);
      if (!isPasswordMatched) throw boom.unauthorized('Bad credentials');

      const plainUser = user.toObject();

      const accessToken = this._jwtService.signAccessToken(plainUser);

      return res.reply({ accessToken });
    } catch (e) {
      return res.reply(e);
    }
  }

  @httpPost('/logout', iocTYPES.AuthMiddleware)
  public async logout(
    @requestHeaders('authorization') authorization: string,
    @response() res: Response,
  ) {
    try {
      const userId = this.httpContext.user.details._id;
      const token = authorization.split(' ')[1];
      await this._sessionService.addToBlacklisted(userId, token);

      return res.message('You have successfully logged out.').reply({ userId });
    } catch (e) {
      return res.reply(e);
    }
  }

  @httpPost('/sign-up', iocTYPES.ValidationMiddleware)
  public async signUp(@requestBody() payload: ISignUpPayload, @response() res: Response) {
    const { firstName, lastName, email, password } = payload;
    const user = { firstName, lastName, email };

    try {
      const verificationToken = this._jwtService.signVerificationToken(user);

      const createdUser = await this._userService.create({
        ...user,
        password,
        verificationToken,
      });

      const plainUser = createdUser.toObject();

      this._queueService.scheduleUserVerificationEmail(email, verificationToken);

      return res.message('An activation link has been sent to your email.').reply(plainUser);
    } catch (e) {
      return res.reply(e);
    }
  }

  @httpPost('/sign-up/finish/:verificationToken')
  public async signUpFinish(
    @requestParam('verificationToken') verificationToken: string,
    @response() res: Response,
  ) {
    try {
      const verifiedUser = await this._userService.verifyAndSaveUser(verificationToken);

      return res.message('User successfully verified').reply(verifiedUser.toObject());
    } catch (e) {
      return res.reply(e);
    }
  }

  @httpGet('/view/sign-up/finish/:verificationToken')
  public async signUpFinishView(
    @requestParam('verificationToken') verificationToken: string,
    @response() res: Response,
  ) {
    try {
      const verifiedUser = await this._userService.verifyAndSaveUser(verificationToken);

      return res.render('auth/verifyEmail', {
        title: 'Hey',
        headerTitle: `Hi, ${verifiedUser.firstName}`,
        message: `Your account has been successfully verified. Now you can log in.`,
      });
    } catch (e) {
      return res.render('auth/verifyEmail', {
        title: 'Error',
        headerTitle: 'There was an error verifying your email',
        message: e.message,
      });
    }
  }
}
