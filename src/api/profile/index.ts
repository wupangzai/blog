import { http } from '@/packages/axios/common';
import type { Profile } from '@/api/types';

export async function getProfileDetail() {
  try {
    const res = await http.postJson<Profile.ProfileDetail>('/api/blog/settings/detail');
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function getProfileStatistics() {
  try {
    const res = await http.postJson<Profile.ProfileStatistics>('/api/statistics/info');
    return res;
  } catch (e) {
    console.log(e);
  }
}
