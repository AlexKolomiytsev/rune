export default interface IGenericDAO<T, TDoc> {
  create(payload: Partial<T>): Promise<TDoc>;
  findById(id: string): Promise<TDoc>;
  findOne(conditions: object): Promise<TDoc>;
}
