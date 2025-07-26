export interface Page {
  current: number;
  size: number;

  [key: string]: any;
}

export interface extraAttributeInPageListApi {
  current: number;
  pages: number;
  size: number;
  total: number;
}
