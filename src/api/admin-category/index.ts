import { http } from '@/packages/axios/common';
import type { AdminCategoryType, CommonType } from '@/api/types';

export async function getAdminCategoryList(pages: CommonType.Page) {
  try {
    const res = await http.postJson<AdminCategoryType.AdminCategoryApi>(
      '/api/admin/category/list',
      pages
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function deleteCategory(id: number) {
  try {
    const res = await http.postJson<AdminCategoryType.DeleteCategoryApi>(
      '/api/admin/category/delete',
      { id }
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function addCategory(name: string) {
  try {
    const res = await http.postJson<AdminCategoryType.AddCategoryApi>('/api/admin/category/add', {
      name,
    });
    return res;
  } catch (e) {
    console.log(e);
  }
}
