import * as boom from 'boom';
import { inject, injectable } from 'inversify';
import { interfaces } from 'inversify-express-utils';
import { Request, Response, NextFunction } from 'express';
import { iocTYPES } from '@app/utils/constants';
import { ILogger, IUserService } from '@app/services';
import Principal from '@app/providers/Principal';
import { IUserModel } from '@app/models/User';
import { ISessionService } from '@app/services/SessionService';

@injectable()
export default class AuthProvider implements interfaces.AuthProvider {
  @inject(iocTYPES.UserService)
  private readonly _userService: IUserService;
  @inject(iocTYPES.SessionService)
  private readonly _sessionService: ISessionService;
  @inject(iocTYPES.Logger)
  private readonly _logger: ILogger;

  public async getUser(req: Request, _: Response, __: NextFunction): Promise<interfaces.Principal> {
    try {
      const { authorization } = req.headers;
      const splittedAuthHeader = authorization && authorization.split(' ');
      const authSchema = splittedAuthHeader && splittedAuthHeader[0];
      const authToken = splittedAuthHeader && splittedAuthHeader[1];
      if (authSchema !== 'Bearer') throw boom.unauthorized('Wrong security schema.');

      const user = (await this._userService.verifyUserAccess(authToken)) as IUserModel;
      const isBlacklisted = await this._sessionService.getIsBlacklisted(user._id, authToken);

      if (isBlacklisted) throw boom.unauthorized();

      return new Principal(user);
    } catch (e) {
      this._logger.warning(e.message);
      return new Principal(null);
    }
  }
}
