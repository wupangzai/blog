import { CommonType } from '@/api/types';

export interface AdminCategoryListItem {
  id: number;
  name: string;
  createTime: string;
  articlesTotal: number;
}

export interface AdminCategoryApi extends CommonType.extraAttributeInPageListApi {
  data: AdminCategoryListItem[];
}

export interface DeleteCategoryApi {
  data: any;
  success: boolean;
}

export interface AddCategoryApi {
  data: any;
  success: boolean;
}
