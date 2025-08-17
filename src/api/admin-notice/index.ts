import { http } from '@/packages/axios/common';
import type { AdminNoticeType } from '@/api/types';

export async function getAdminNoticeList(pages: AdminNoticeType.AdminNoticeListApiPayload) {
  try {
    const res = await http.postJson<AdminNoticeType.AdminNoticeListApi>(
      '/api/admin/notice/list',
      pages
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function updateIsShow(payload: AdminNoticeType.updateIsShowApiPayload) {
  try {
    const res = await http.postJson<AdminNoticeType.updateIsShowApi>(
      '/api/admin/notice/isShow/update',
      payload
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function deleteNotice(id: number) {
  try {
    const res = await http.postJson<AdminNoticeType.DeleteNoticeApi>('/api/admin/notice/delete', {
      id,
    });
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function addNotice(payload: AdminNoticeType.AddNoticeApiPayload) {
  try {
    const res = await http.postJson<AdminNoticeType.AddNoticeApi>('/api/admin/notice/add', payload);
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function updateNotice(payload: AdminNoticeType.UpdateNoticeApiPayload) {
  try {
    const res = await http.postJson<AdminNoticeType.UpdateNoticeApi>(
      '/api/admin/notice/update',
      payload
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}
