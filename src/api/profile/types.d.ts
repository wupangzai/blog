export interface ProfileDetailData {
  author: string;
  avatar: string;
  csdnHomepage: string;
  giteeHomepage: string;
  githubHomepage: string;
  introduction: string;
  logo: string;
  name: string;
  zhihuHomepage: string;
}

export interface ProfileDetail {
  data: ProfileDetailData;
}

export interface ProfileStatisticsData {
  articleTotalCount: number;
  categoryTotalCount: number;
  pvTotalCount: number;
  tagTotalCount: number;
}

export interface ProfileStatistics {
  data: ProfileStatisticsData;
}
