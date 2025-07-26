import { CommonType } from '@/api/types';
export interface AdminArticleListItem {
  id: number;
  title: string;
  cover: string;
  createTime: string;
  isPublish: boolean;
  isTop: boolean;
}

export interface AdminArticleListApi extends CommonType.extraAttributeInPageListApi {
  data: AdminArticleListItem[];
}

export interface DeleteArticleApi {
  data: any;
  success: boolean;
}

export interface ToggleArticleOptionsApi {
  data: any;
  success: boolean;
}
