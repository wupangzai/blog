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

export async function getDashboardPAStatistics() {
  try {
    const res = await http.postJson<AdminDashBoardType.DashboardPAStatisticsApi>(
      '/api/admin/dashboard/publishArticle/statistics'
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function getDashboardPvStatistics() {
  try {
    const res = await http.postJson<AdminDashBoardType.DashboardPvStatisticsApi>(
      '/api/admin/dashboard/pv/statistics'
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function getDashboardCategoryStatistics() {
  try {
    const res = await http.postJson<AdminDashBoardType.DashboardCategoryStatisticsApi>(
      '/api/admin/dashboard/category/statistics'
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function getDashboardTagStatistics() {
  try {
    const res = await http.postJson<AdminDashBoardType.DashboardTagStatisticsApi>(
      '/api/admin/dashboard/tag/statistics'
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}
