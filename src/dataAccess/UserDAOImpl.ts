import { injectable } from 'inversify';
import { IUserDAO } from '@app/types';
import { IUserModel, User } from '@app/models/User';
import { UserModel } from '@app/models';

@injectable()
export default class UserDAOImpl implements IUserDAO<User, IUserModel> {
  public create(payload: IUserModel): Promise<IUserModel> {
    return UserModel.create(payload);
  }

  public async findById(id: string): Promise<IUserModel> {
    return UserModel.findById(id);
  }

  public async findOne(conditions: object): Promise<IUserModel> {
    return UserModel.findOne(conditions);
  }

  public async find(
    conditions: any,
    options: any | null,
    projection: any | null = '-password -verificationToken',
  ): Promise<IUserModel[]> {
    return UserModel.find(conditions, projection, options);
  }

  public async count(options: any): Promise<number> {
    return UserModel.estimatedDocumentCount(options);
  }

  public isPasswordsMatched(user: User, password: string): Promise<boolean> | null {
    return user.comparePasswords(password);
  }
}
