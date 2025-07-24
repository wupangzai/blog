export interface DashboardStatistics {
  articleTotalCount: number;
  categoryTotalCount: number;
  pvTotalCount: number;
  tagTotalCount: number;
}

export interface DashboardPAStatisticsApi {
  data: Record<string, number>;
}

export interface DashboardStatisticsApi {
  data: DashboardStatistics;
}

export interface DashboardPvStatistics {
  pvCounts: number[];
  pvDates: number[];
}

export interface DashboardPvStatisticsApi {
  data: DashboardPvStatistics;
}

export interface DashboardCategoryStatistics {
  name: string;
  value: number;
}

export interface DashboardCategoryStatisticsApi {
  data: DashboardCategoryStatistics[];
}

export interface DashboardTagStatistics {
  articleCounts: number[];
  tagNames: string[];
}

export interface DashboardTagStatisticsApi {
  data: DashboardTagStatistics;
}
