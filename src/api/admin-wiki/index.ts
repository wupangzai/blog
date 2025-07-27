import { http } from '@/packages/axios/common';
import type { AdminWikiType, CommonType } from '@/api/types';
import type { UploadFile } from 'element-plus';

export async function getAdminWikiList(pages: CommonType.Page) {
  try {
    const res = await http.postJson<AdminWikiType.AdminWikiApi>('/api/admin/wiki/list', pages);
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function deleteArticle(id: number) {
  try {
    const res = await http.postJson<AdminWikiType.DeleteWikiApi>('/api/admin/wiki/delete', {
      id,
    });
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function toggleIsTop(id: number, isTop: boolean) {
  try {
    const res = await http.postJson<AdminWikiType.ToggleWikiOptionsApi>(
      '/api/admin/wiki/isTop/update',
      { id, isTop }
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function toggleIsPublish(id: number, isPublish: boolean) {
  try {
    const res = await http.postJson<AdminWikiType.ToggleWikiOptionsApi>(
      '/api/admin/wiki/isPublish/update',
      { id, isPublish }
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function adminUploadfile(file: UploadFile['raw']) {
  try {
    const res = await http.postMulti<AdminWikiType.AdminUploadFileApi>('/api/admin/file/upload', {
      file,
    });
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function addAdminWiki(payload: AdminWikiType.AddWikiApiPayload) {
  try {
    const res = await http.postJson<AdminWikiType.AddWikiApi>('/admin/wiki/add', payload);
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function getAdminWikiCatelogList(id: number) {
  try {
    const res = await http.postJson<AdminWikiType.getAdminWikiCatelogList>(
      '/api/admin/wiki/catalog/list',
      id
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function updateAdminWikiCatelog(payload: AdminWikiType.addAdminWikiCatelogApiPayload) {
  try {
    const res = await http.postJson<AdminWikiType.addAdminWikiCatelogApi>(
      '/api/admin/wiki/catalog/update',
      payload
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}
