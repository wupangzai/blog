import { http } from '@/packages/axios/common';
import type { AdminTagType, CommonType } from '@/api/types';

export async function getAdminTagList(pages: CommonType.Page) {
  try {
    const res = await http.postJson<AdminTagType.AdminTagApi>('/api/admin/tag/list', pages);
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function deleteTag(id: number) {
  try {
    const res = await http.postJson<AdminTagType.DeleteTagApi>('/api/admin/tag/delete', { id });
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function addTag(tags: string[]) {
  try {
    const res = await http.postJson<AdminTagType.AddTagApi>('/api/admin/tag/add', {
      tags,
    });
    return res;
  } catch (e) {
    console.log(e);
  }
}
