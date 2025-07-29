export interface BlogSettingDetail {
  author: string;
  avatar: string;
  csdnHomepage: string;
  giteeHomepage: string;
  githubHomepage: string;
  introduction: string;
  isCommentExamineOpen: boolean;
  isCommentSensiWordOpen: boolean;
  logo: string;
  mail: string;
  name: string;
  zhihuHomepage: string;
}

export interface getBlogSettingDetailApi {
  data: BlogSettingDetail;
}

export interface UpdateSettingApi {
  data: any;
  success: boolean;
}
