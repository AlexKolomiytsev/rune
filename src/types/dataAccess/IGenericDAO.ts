import { ModelFindByIdAndUpdateOptions } from 'mongoose';

export default interface IGenericDAO<T, TDoc> {
  create(payload: Partial<T>): Promise<TDoc>;
  findById(id: string): Promise<TDoc>;
  findOne(conditions: object): Promise<TDoc>;
  find(conditions: any, options?: any | null, projection?: any | null): Promise<TDoc[]>;
  findOneAndUpdate(
    conditions: any,
    update: any,
    options?: ModelFindByIdAndUpdateOptions,
  ): Promise<TDoc>;
  count(conditions?: any, options?: any): Promise<number>;
}
