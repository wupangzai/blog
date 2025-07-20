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
