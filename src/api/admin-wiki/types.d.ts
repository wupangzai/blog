import { CommonType } from '@/api/types';

export interface AdminWikiListItem {
  id: number;
  title: string;
  cover: string;
  createTime: string;
  isPublish: boolean;
  isTop: boolean;
  firstArticleId: number;
  summary: string;
}

export interface AdminWikiApi extends CommonType.extraAttributeInPageListApi {
  data: AdminWikiListItem[];
}

export interface DeleteWikiApi {
  data: null;
  success: boolean;
}

export interface AddWikiApiPayload {
  cover: string;
  summary: string;
  title: string;
}
export interface AddWikiApi {
  data: null;
  success: boolean;
}

export interface ToggleWikiOptionsApi {
  data: any;
  success: boolean;
}

export interface UploadData {
  url: string;
}
export interface AdminUploadFileApi {
  data: UploadData;
  success: boolean;
}

export interface AdminWikiCatelogItem {
  articleId: number | null;
  children: addAdminWikiCatelogItem[];
  editing: boolean;
  id: number;
  level: number;
  sort: number;
  title: string;
  index?: number;
}

export interface getAdminWikiCatelogList {
  data: AdminWikiCatelogItem[];
}

export interface addAdminWikiCatelogApiPayload {
  catalogs: AdminWikiCatelogItem[];
  id: number;
}
export interface addAdminWikiCatelogApi {
  data: null;
  success: boolean;
}
