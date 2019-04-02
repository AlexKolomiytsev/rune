import * as Joi from 'joi';
import { BaseMiddleware } from 'inversify-express-utils';
import { Request, Response, NextFunction } from 'express';
import { get } from 'lodash';

import validators from '@app/utils/validators';

export default class ValidationMiddleware extends BaseMiddleware {
  public async handler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const routePath = req.route.path;
      const method = req.method;

      const body = req.body;
      const params = req.params;
      const query = req.query;

      const data = { ...body, ...params, ...query };

      const schema = get(validators, [routePath, method]);

      if (!schema || !schema.isJoi) return next();

      await Joi.validate(data, schema, { abortEarly: false, convert: true });

      return next();
    } catch (e) {
      const details =
        e.details &&
        e.details.map(({ message, type }: Joi.ValidationErrorItem) => ({
          message: message.replace(/['"]/g, ''),
          type,
        }));

      return res
        .meta({ details })
        .message(e.name)
        .reply(e);
    }
  }
}
