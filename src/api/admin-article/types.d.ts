export interface AdminArticleListPage {
  current: number;
  size: number;

  [key: string]: any;
}

export interface AdminArticleListItem {
  id: number;
  title: string;
  cover: string;
  createTime: string;
  isPublish: boolean;
  isTop: boolean;
}

export interface AdminArticleListApi {
  data: AdminArticleListItem[];
  total: number;
  pages: number;
  size: number;
}
