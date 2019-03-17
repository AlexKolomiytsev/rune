import { injectable } from 'inversify';
import * as jsonwebtoken from 'jsonwebtoken';
import * as boom from 'boom';
import config from '@app/utils/config';
import { ERROR_NAME_TO_MESSAGE } from '@app/utils/mappers';

export interface IJwtService<T> {
  verify(
    token: string,
    secretOrPublicKey: string | Buffer,
    options?: jsonwebtoken.VerifyOptions,
  ): Promise<T | string>;
  throwableVerify(
    token: string,
    secretOrPublicKey: string | Buffer,
    options?: jsonwebtoken.VerifyOptions,
  ): Promise<T | string>;
  signAccessToken(payload: string | Buffer | object): string;
  signVerificationToken(payload: string | Buffer | object): string;
}

@injectable()
export default class JwtService implements IJwtService<object> {
  private static sign(
    payload: string | Buffer | object,
    secret: jsonwebtoken.Secret,
    expiresIn: string,
    options?: jsonwebtoken.SignOptions,
  ): string {
    return jsonwebtoken.sign(payload, secret, { expiresIn, ...options });
  }

  public async verify(
    token: string,
    secretOrPublicKey: string | Buffer,
    options?: jsonwebtoken.VerifyOptions,
  ): Promise<object | string> {
    return await jsonwebtoken.verify(token, secretOrPublicKey, options);
  }

  public async throwableVerify(
    token: string,
    secretOrPublicKey: string | Buffer,
    options?: jsonwebtoken.VerifyOptions,
  ): Promise<object | string> {
    try {
      return await this.verify(token, secretOrPublicKey, options);
    } catch (e) {
      const { name } = e;
      throw boom.unauthorized(ERROR_NAME_TO_MESSAGE[name]);
    }
  }

  public signAccessToken(payload: string | Buffer | object): string {
    return JwtService.sign(
      payload,
      config.get('/auth/accessTokenSecret'),
      config.get('/auth/accessTokenExpiresIn'),
    );
  }

  public signVerificationToken(payload: string | Buffer | object): string {
    return JwtService.sign(
      payload,
      config.get('/auth/verificationTokenSecret'),
      config.get('/auth/verificationTokenExpiresIn'),
    );
  }
}
