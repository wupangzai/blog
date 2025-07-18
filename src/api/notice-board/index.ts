import { http } from '@/packages/axios/common';
import type { NoticeBoard } from '@/api/notice-board/types';

export async function getNotice() {
  try {
    const res = await http.postJson<NoticeBoard>('/api/notice/info');
    return res;
  } catch (e) {
    console.log(e);
  }
}
