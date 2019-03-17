import { Response } from 'express';
import {
  BaseHttpController,
  controller,
  httpGet,
  interfaces,
  response,
} from 'inversify-express-utils';
import { iocTYPES } from '@app/utils/constants';

@controller('/users', iocTYPES.AuthMiddleware)
export default class UsersController extends BaseHttpController implements interfaces.Controller {
  @httpGet('/me')
  public async getMe(@response() res: Response) {
    try {
      const user = this.httpContext.user;

      return res.reply(user.details);
    } catch (e) {
      return res.reply(e);
    }
  }
}
