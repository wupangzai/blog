import { http } from '@/packages/axios/common';
import type { AdminArticleType } from '@/api/types';

export async function getAdminArticleList(pages: AdminArticleType.AdminArticleListPage) {
  try {
    const res = await http.postJson<AdminArticleType.AdminArticleListApi>(
      '/api/admin/article/list',
      pages
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}
