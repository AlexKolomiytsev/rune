import { inject, injectable } from 'inversify';
import { interfaces } from 'inversify-express-utils';
import { Request, Response, NextFunction } from 'express';
import { iocTYPES } from '@app/utils/constants';
import { IUserService } from '@app/services';
import Principal from '@app/providers/Principal';

@injectable()
export default class AuthProvider implements interfaces.AuthProvider {
  @inject(iocTYPES.UserService)
  private readonly _userService: IUserService;

  public async getUser(req: Request, _: Response, __: NextFunction): Promise<interfaces.Principal> {
    try {
      const { authorization } = req.headers;
      const authToken = authorization && authorization.split(' ')[1];

      const user = await this._userService.verifyUserAccess(authToken);

      return new Principal(user);
    } catch (e) {
      return new Principal(null);
    }
  }
}
