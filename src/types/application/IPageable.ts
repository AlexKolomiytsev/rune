export interface IPageableMeta {
  totalCount: number;
  skip: 0;
  limit: 0;
}

export interface IPageable<T> {
  items: T;
  meta: IPageableMeta;
}
