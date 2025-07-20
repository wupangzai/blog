import { http } from '@/packages/axios/common';
import type { TagsCardType } from '@/api/types';

export async function getCategoryList(size?: number) {
  try {
    const res = await http.postJson<TagsCardType.CategoryList>('/api/category/list', {
      size,
    });

    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function getCategoryArticleList(page: TagsCardType.Page) {
  try {
    const res = await http.postJson<TagsCardType.CategoryArticleList>(
      '/api/category/article/list',
      page
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function getTagList(size?: number) {
  try {
    const res = await http.postJson<TagsCardType.TagList>('/api/tag/list', {
      size,
    });

    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function getTagArticleList(page: TagsCardType.Page) {
  try {
    const res = await http.postJson<TagsCardType.CategoryArticleList>(
      '/api/tag/article/list',
      page
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}
