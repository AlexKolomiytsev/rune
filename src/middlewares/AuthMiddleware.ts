import * as boom from 'boom';
import { Request, Response, NextFunction } from 'express';
import { BaseMiddleware } from 'inversify-express-utils';
import { injectable } from 'inversify';

@injectable()
export default class AuthMiddleware extends BaseMiddleware {
  public async handler(_: Request, res: Response, next: NextFunction): Promise<void> {
    const { user } = this.httpContext;

    try {
      const isAuthenticated = await user.isAuthenticated();

      if (!isAuthenticated) {
        return res.reply(boom.unauthorized());
      }

      return next();
    } catch (e) {
      return res.reply(e);
    }
  }
}
