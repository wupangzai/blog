export const defaultDashboardStatistics = () => {
  return {
    articleTotalCount: 0,
    categoryTotalCount: 0,
    pvTotalCount: 0,
    tagTotalCount: 0,
  };
};

export const defaultDashboardPvStatistics = () => {
  return {
    pvCounts: [],
    pvDates: [],
  };
};

export const defaultDashboardTagStatistics = () => {
  return {
    articleCounts: [],
    tagNames: [],
  };
};
