import * as jsonwebtoken from 'jsonwebtoken';
import * as boom from 'boom';

import { ERROR_NAME_TO_MESSAGE } from '../mappers';

export const verifyJwt = async (token: string, secret: string): Promise<any> => {
  try {
    return await jsonwebtoken.verify(token, secret);
  } catch (e) {
    const { name } = e;
    throw boom.unauthorized(ERROR_NAME_TO_MESSAGE[name]);
  }
};
