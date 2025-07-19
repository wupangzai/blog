import { http } from '@/packages/axios/common';
import type { ArticleType } from '@/api/types';

export async function getArticleList(page: ArticleType.Page) {
  try {
    const res = await http.postJson<ArticleType.ArticleList>('/api/article/list', page);
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function getArticleDetail(id: number) {
  try {
    const res = await http.postJson<ArticleType.ArticleDetail>('/api/article/detail', {
      articleId: id,
    });
    return res.data;
  } catch (e) {
    console.log(e);
  }
}
