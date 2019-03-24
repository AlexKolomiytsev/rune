import { Response } from 'express';
import {
  BaseHttpController,
  controller,
  httpGet,
  interfaces,
  queryParam,
  response,
} from 'inversify-express-utils';
import { iocTYPES } from '@app/utils/constants';
import { inject } from 'inversify';
import { IUserService } from '@app/services';

@controller('/users', iocTYPES.AuthMiddleware)
export default class UsersController extends BaseHttpController implements interfaces.Controller {
  @inject(iocTYPES.UserService)
  private readonly _userService: IUserService;

  @httpGet('/me')
  public async getMe(@response() res: Response) {
    try {
      const user = this.httpContext.user;

      return res.reply(user.details);
    } catch (e) {
      return res.reply(e);
    }
  }

  @httpGet('/')
  public async getAll(
    @response() res: Response,
    @queryParam('skip') skip: number,
    @queryParam('limit') limit: number,
  ) {
    try {
      const { items, meta } = await this._userService.findAll(null, { skip, limit });

      return res.meta(meta).reply(items);
    } catch (e) {
      return res.reply(e);
    }
  }
}
