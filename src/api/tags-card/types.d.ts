import { ArticleType } from '@/api/types';

export interface CategoryListItem {
  id: number;
  articlesTotal: number;
  name: string;
}

export interface CategoryList {
  data: CategoryListItem[];
}

export interface TagListItem {
  id: number;
  articlesTotal: number;
  name: string;
}

export interface TagList {
  data: TagListItem[];
}

export interface Page {
  current: number;
  id: string;
  size: number;
  total?: number;
}

export type CategoryArticleListItem = Pick<
  ArticleType.ArticleItem,
  'cover' | 'createDate' | 'id' | 'title'
>;

export interface CategoryArticleList extends ArticleType.Page {
  data: CategoryArticleListItem[];
}
