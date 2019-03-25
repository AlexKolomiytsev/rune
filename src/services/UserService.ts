import { injectable, inject } from 'inversify';
import * as boom from 'boom';
import { isNil } from 'lodash';
import { IPageable, IUserDAO } from '@app/types';
import { IUserModel, User } from '@app/models/User';
import { iocTYPES } from '@app/utils/constants';
import { IJwtService } from '@app/services/JwtService';
import config from '@app/utils/config';

const verificationTokenSecret = config.get('/auth/verificationTokenSecret');
const accessTokenSecret = config.get('/auth/accessTokenSecret');

export interface IUserService {
  create(user: Partial<User>): Promise<IUserModel>;
  findOne(conditions: any): Promise<IUserModel>;
  findAll(conditions?: any, options?: any): Promise<IPageable<IUserModel[]>>;
  isPasswordMatched(user: IUserModel, password: string): Promise<boolean> | null;
  verifyAndSaveUser(verificationToken: string): Promise<IUserModel>;
  verifyUserAccess(accessToken: string): Promise<User>;
}

@injectable()
export default class UserService implements IUserService {
  @inject(iocTYPES.UserDAO)
  private readonly _userDAO: IUserDAO<User, IUserModel>;
  @inject(iocTYPES.Jwt)
  private readonly _jwtService: IJwtService<User>;

  public create(user: Partial<User>): Promise<IUserModel> {
    return this._userDAO.create(user);
  }

  public findOne(conditions: object): Promise<IUserModel> {
    return this._userDAO.findOne(conditions);
  }

  public async findAll(conditions: any, options: any = {}): Promise<IPageable<IUserModel[]>> {
    const { skip = 0, limit = 0 } = options;
    const pageable = !isNil(skip) && !isNil(limit);
    if (pageable) {
      options.skip = Number(skip);
      options.limit = Number(limit);
    }

    return {
      items: await this._userDAO.find(conditions, options),
      meta: {
        totalCount: pageable && (await this._userDAO.count(conditions)),
        skip,
        limit,
      },
    };
  }

  public isPasswordMatched(user: IUserModel, password: string): Promise<boolean> | null {
    return this._userDAO.isPasswordsMatched(user, password);
  }

  public async verifyUserAccess(accessToken: string): Promise<User> {
    const encoded = await this._jwtService.throwableVerify(accessToken, accessTokenSecret);
    if (typeof encoded === 'object') return encoded;
  }

  public async verifyAndSaveUser(verificationToken: string): Promise<IUserModel> {
    const encoded = await this._jwtService.throwableVerify(
      verificationToken,
      verificationTokenSecret,
    );

    if (typeof encoded === 'object') {
      const { email } = encoded;
      const user = await this.findOne({ email });

      if (!user) throw boom.notFound('User does not exist', { email });
      if (user.isVerified) throw boom.badRequest('User is already verified', { email });

      user.isVerified = true;
      user.verificationToken = null;

      return await user.save();
    }
  }
}
