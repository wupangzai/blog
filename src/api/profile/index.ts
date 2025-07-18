import { http } from '@/packages/axios/common';
import type { ProfileDetail, ProfileStatistics } from '@/api/profile/types';

export async function getProfileDetail() {
  try {
    const res = await http.postJson<ProfileDetail>('/api/blog/settings/detail');
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function getProfileStatistics() {
  try {
    const res = await http.postJson<ProfileStatistics>('/api/statistics/info');
    return res;
  } catch (e) {
    console.log(e);
  }
}
