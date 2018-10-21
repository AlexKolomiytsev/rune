import * as jsonwebtoken from 'jsonwebtoken';
import * as boom from 'boom';

import { ERROR_NAME_TO_MESSAGE } from '@app/mappers';

export const verifyJwt = async (token: string, secret: string): Promise<any> => {
  try {
    const decoded = await jsonwebtoken.verify(token, secret);

    return decoded;
  } catch (e) {
    const { name } = e;
    throw boom.unauthorized(ERROR_NAME_TO_MESSAGE[name]);
  }
};
