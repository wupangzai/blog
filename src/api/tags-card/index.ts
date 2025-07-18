import { http } from '@/packages/axios/common';
import type { CategoryListItem, TagListItem } from '@/api/tags-card/types';

export async function getCategoryList(size: number) {
  try {
    const res = await http.postJson<CategoryListItem[]>('/api/category/list', {
      size,
    });

    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function getTagList(size: number) {
  try {
    const res = await http.postJson<TagListItem[]>('/api/tag/list', {
      size,
    });

    return res;
  } catch (e) {
    console.log(e);
  }
}
