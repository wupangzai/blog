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
