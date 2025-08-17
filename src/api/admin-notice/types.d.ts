import { CommonType } from '@/api/types';

export interface AdminNoticeListApiPayload extends CommonType.Page {
  content?: string;
  isShow?: boolean;
  endDate?: string;
  startDate?: string;
}

export interface AdminNoticeListItem {
  id: number;
  content: string;
  createTime: string;
  isShow: boolean;
  updateTime: string;
}

export interface AdminNoticeListApi extends CommonType.extraAttributeInPageListApi {
  data: AdminNoticeListItem[];
}

export interface DeleteNoticeApi {
  data: null;
  success: boolean;
}

export interface updateIsShowApiPayload {
  id: number;
  isShow: boolean;
}

export interface updateIsShowApi {
  data: null;
  success: boolean;
}

export interface AddNoticeApiPayload {
  content: string;
  isShow: boolean;
}

export interface AddNoticeApi {
  data: null;
  success: boolean;
}

export interface UpdateNoticeApiPayload {
  content: string;
  id: number;
}

export interface UpdateNoticeApi {
  data: null;
  success: boolean;
}
