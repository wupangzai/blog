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
