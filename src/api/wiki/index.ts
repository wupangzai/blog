import { http } from '@/packages/axios/common';
import type { WikiType } from '@/api/types';

export async function getWikiList() {
  try {
    const res = await http.postJson<WikiType.WikiList>('/api/wiki/list');
    return res;
  } catch (e) {
    console.log(e);
  }
}

// wiki-detial页面，左边的目录接口
export async function getWikiCatalogList(id: number) {
  try {
    const res = await http.postJson<WikiType.WikiCatalogList>('/api/wiki/catalog/list', { id });
    return res;
  } catch (e) {
    console.log(e);
  }
}
