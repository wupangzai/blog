import { TagsCardType } from '@/api/types';

export interface Page {
  current: number;
  page: number;
  size: number;
  total: number;
}

interface ArticleItem {
  id: string;
  category: TagsCardType.CategoryListItem;
  cover: string;
  createDate: string;
  isTop: boolean;
  summary: string;
  tags: TagsCardType.TagListItem[];
  title: string;
}

export interface ArticleList extends Page {
  data: ArticleItem[];
}
