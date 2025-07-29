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

export interface AdminCategorySelectLsitItem {
  label: string;
  value: number;
}
export interface getAdminCategorySelectLsitApi {
  data: AdminCategorySelectLsitItem[];
}

export interface PublishArticleApiPayload {
  title: string;
  content: string;
  cover: string;
  summary: string;
  categoryId: number | null;
  tags: number[];
  tagIds?: number[];
  id?: number;
}
export interface PublishArticleApi {
  data: null;
  success: boolean;
}

export interface GetAdminArticleDetail {
  data: PublishArticleApiPayload;
}
