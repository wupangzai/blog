import { http } from '@/packages/axios/common';
import type { AdminUserType } from '@/api/types';

export async function getAdminUserInfo() {
  try {
    const res = await http.postJson<AdminUserType.AdminUserInfoApi>('/api/admin/user/info');
    return res;
  } catch (e) {
    console.log(e);
  }
}
