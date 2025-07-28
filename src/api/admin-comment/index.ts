import { http } from '@/packages/axios/common';
import type { AdminCommentType } from '@/api/types';

export async function getAdminCommentList(pages: AdminCommentType.AdminComentListApiPayload) {
  try {
    const res = await http.postJson<AdminCommentType.AdminCategoryApi>(
      '/api/admin/comment/list',
      pages
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function deleteComment(id: number) {
  try {
    const res = await http.postJson<AdminCommentType.DeleteCommentApi>(
      '/api/admin/comment/delete',
      { id }
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}
