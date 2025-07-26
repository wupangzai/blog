import { http } from '@/packages/axios/common';
import type { AdminArticleType, CommonType } from '@/api/types';

export async function getAdminArticleList(pages: CommonType.Page) {
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

export async function deleteArticle(id: number) {
  try {
    const res = await http.postJson<AdminArticleType.DeleteArticleApi>(
      '/api/admin/article/delete',
      { id }
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function toggleIsTop(id: number, isTop: boolean) {
  try {
    const res = await http.postJson<AdminArticleType.ToggleArticleOptionsApi>(
      '/api/admin/article/isTop/update',
      { id, isTop }
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function toggleIsPublish(id: number, isPublish: boolean) {
  try {
    const res = await http.postJson<AdminArticleType.ToggleArticleOptionsApi>(
      '/api/admin/article/isPublish/update',
      { id, isPublish }
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}
