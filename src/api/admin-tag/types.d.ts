import { CommonType } from '@/api/types';

export interface AdminTagListItem {
  id: number;
  name: string;
  createTime: string;
  articlesTotal: number;
}

export interface AdminTagApi extends CommonType.extraAttributeInPageListApi {
  data: AdminTagListItem[];
}

export interface DeleteTagApi {
  data: null;
  success: boolean;
}

export interface AddTagApi {
  data: null;
  success: boolean;
}
