import { TagsCardType, CommonType } from '@/api/types';

export interface Page {
  current: number;
  page: number;
  size?: number;
  total: number;
}

export interface ArticleItem {
  id: number;
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

export interface NextOrPreArticle {
  articleId: number;
  articleTitle: string;
}
export interface ArticleDetailData {
  categoryId: number;
  categoryName: string;
  content: string; // html
  createTime: string;
  nextArticle: NextOrPreArticle;
  preArticle: NextOrPreArticle;
  readNum: number;
  readTime: string;
  tags: TagsCardType.TagListItem[];
  title: string;
  totalWords: number;
  updateTime: string;
}
export interface ArticleDetail {
  data: ArticleDetailData;
}

export interface ArticleSearchPayload extends CommonType.Page {
  word: string;
}

export type ArticleSearchItem = Omit<ArticleItem, 'tags' | 'isTop' | 'category'>;

export interface SearchArticleApi {
  data: ArticleSearchItem[];
}
