import { Response } from 'express';
import {
  BaseHttpController,
  controller,
  httpGet,
  httpPatch,
  interfaces,
  queryParam,
  requestBody,
  requestParam,
  response,
} from 'inversify-express-utils';
import { iocTYPES } from '@app/utils/constants';
import { inject } from 'inversify';
import { IUserService } from '@app/services';
import { User } from '@app/models/User';

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
    @queryParam('search') search: string,
  ) {
    try {
      const searchRegex = new RegExp(search, 'i');

      // TODO: make it more generic
      const query = {
        $or: [{ email: searchRegex }, { firstName: searchRegex }, { lastName: searchRegex }],
      };

      const { items, meta } = await this._userService.findAll(query, { skip, limit });
      return res.meta(meta).reply(items);
    } catch (e) {
      return res.reply(e);
    }
  }

  @httpPatch('/:id')
  public async update(
    @requestBody() payload: Partial<User>,
    @requestParam('id') userId: string,
    @response() res: Response,
  ) {
    try {
      const result = await this._userService.findByIdAndUpdate(userId, payload);

      return res.reply(result.toJSON());
    } catch (e) {
      return res.reply(e);
    }
  }
}
