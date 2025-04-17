export interface IResponseData<T> {
  pageSize: number;
  pageNumber: number;
  totalCount: number;
  items: T[];
}
export interface IMenuItemQuery {
  name: string;
  persianName: string;
  id: string;
  description: string;
  selfId: number;
  link: string | null;
  isReadOnly: boolean;
  parent?: IMenuItemQuery;
  parentId?: string;
  permittedPage: string[];
  children: IMenuItemQuery[];
}
