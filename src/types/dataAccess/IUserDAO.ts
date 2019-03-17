import IGenericDAO from './IGenericDAO';

export default interface IUserDAO<T, TDoc> extends IGenericDAO<T, TDoc> {
  isPasswordsMatched(user: TDoc, password: string): Promise<boolean> | null;
}
