import dashboardArticleSvg from '@/assets/svg/dashboard-article.svg';
import dashboardCategoriesSvg from '@/assets/svg/dashboard-categories.svg';
import dashboardTagsSvg from '@/assets/svg/dashboard-tags.svg';
import dashboardOverviewSvg from '@/assets/svg/dashboard-overview.svg';

export interface DashboardStatisticsListItem {
  key: string;
  label: string;
  icon: string;
  count?: number;
}

export const dashboardStatisticsList: DashboardStatisticsListItem[] = [
  {
    key: 'articleTotalCount',
    label: '文章',
    icon: dashboardArticleSvg,
  },
  {
    key: 'categoryTotalCount',
    label: '分类',
    icon: dashboardCategoriesSvg,
  },
  {
    key: 'tagTotalCount',
    label: '标签',
    icon: dashboardTagsSvg,
  },
  {
    key: 'pvTotalCount',
    label: '总浏览量',
    icon: dashboardOverviewSvg,
  },
];
