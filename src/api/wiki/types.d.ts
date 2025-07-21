export interface WikiListItem {
  cover: string;
  firstArticleId: number;
  id: number;
  isTop: true;
  summary: string;
  title: string;
}

export interface WikiList {
  data: WikiListItem[];
}

export interface CatalogListItem {
  articleId: number; // 目前都是null，不知道想干嘛
  children: CatalogListItem[];
  id: number;
  level: number;
  title: number;
  index?: string;
}

export interface WikiCatalogList {
  data: CatalogListItem[];
}
