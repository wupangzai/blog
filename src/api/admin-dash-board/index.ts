import { http } from '@/packages/axios/common';
import type { AdminDashBoardType } from '@/api/types';

export async function getDashboardStatistics() {
  try {
    const res = await http.postJson<AdminDashBoardType.DashboardStatisticsApi>(
      '/api/admin/dashboard/statistics'
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}
