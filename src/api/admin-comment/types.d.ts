import { CommonType } from '@/api/types';

export type Status = 1 | 2 | 3 | null;
export interface AdminComentListApiPayload extends CommonType.Page {
  startDate?: string;
  endDate?: string;
  routerUrl?: string;
  status?: Status;
}

export interface AdminCommentListItem {
  id: number;
  avatar: string;
  content: string;
  createTime: string;
  mail: string;
  nickname: string;
  reason: string;
  routerUrl: string;
  status: 2;
  website: any;
}

export interface AdminCategoryApi extends CommonType.extraAttributeInPageListApi {
  data: AdminCommentListItem[];
}

export interface DeleteCommentApi {
  data: any;
  success: boolean;
}
