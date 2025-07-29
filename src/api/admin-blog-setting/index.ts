import { http } from '@/packages/axios/common';
import type { AdminBlogSettingType } from '@/api/types';

export async function getBlogSettingDetail() {
  try {
    const res = await http.postJson<AdminBlogSettingType.getBlogSettingDetailApi>(
      '/api/admin/blog/settings/detail'
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function updateSetting(payload: AdminBlogSettingType.BlogSettingDetail) {
  try {
    const res = await http.postJson<AdminBlogSettingType.UpdateSettingApi>(
      '/api/admin/blog/settings/update',
      payload
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}
