import type { ArticleType, TagsCardType } from '@/api/types';

export interface AchieveListItem {
  articles: TagsCardType.CategoryArticleListItem[];
  month: string;
}

export interface AchieveListData extends ArticleType.Page {
  data: AchieveListItem[];
}
