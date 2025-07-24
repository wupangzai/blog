export interface DashboardStatistics {
  articleTotalCount: number;
  categoryTotalCount: number;
  pvTotalCount: number;
  tagTotalCount: number;
}

export interface DashboardStatisticsApi {
  data: DashboardStatistics;
}
