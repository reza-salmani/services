export interface IResponseData<T> {
  pageSize: number;
  pageNumber: number;
  totalCount: number;
  items: T[];
}
