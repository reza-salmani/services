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
  parentId: number | null;
  link: string | null;
  isReadOnly: boolean;
  roles: string[];
}
export interface IMenuItem extends IMenuItemQuery {
  children: IMenuItem[];
}
