import { Request, Response, NextFunction } from 'express';
import * as boom from 'boom';
import config from '@app/utils/config';
import { verifyJwt } from '@app/utils/helpers';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken: queryAccessToken } = req.query;
    const { accessToken: bodyAccessToken } = req.body;
    const { authorization } = req.headers;
    const headersAccessToken = authorization && authorization.split(' ')[1];

    const accessToken = headersAccessToken || bodyAccessToken || queryAccessToken;

    if (!accessToken) throw boom.unauthorized('No accessToken provided');

    const decoded = await verifyJwt(accessToken, config.get('/auth/accessTokenSecret'));

    req.user = decoded;

    return next();
  } catch (e) {
    return res.reply(e);
  }
};
