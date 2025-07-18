import { TagsCardType } from '@/api/types';

export interface Page {
  current: number;
  size: number;
}

export interface ArticleList {
  id: string;
  category: TagsCardType.CategoryListItem;
  cover: string;
  createDate: string;
  isTop: boolean;
  summary: string;
  tags: TagsCardType.TagListItem[];
  title: string;
  current: number;
  page: number;
  size: number;
  total: number;
}
