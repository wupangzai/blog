import { http } from '@/packages/axios/common';
import type { ArticleType, AchieveType } from '@/api/types';

export async function getAchieveList(page: ArticleType.Page) {
  try {
    const res = await http.postJson<AchieveType.AchieveListData>('/api/archive/list', page);
    return res;
  } catch (e) {
    console.log(e);
  }
}
