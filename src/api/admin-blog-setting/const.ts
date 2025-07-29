import type { AdminBlogSettingType } from '@/api/types';

export const getDefaultBlogSettingDetail = (): AdminBlogSettingType.BlogSettingDetail => {
  return {
    author: '',
    avatar: '',
    csdnHomepage: '',
    giteeHomepage: '',
    githubHomepage: '',
    introduction: '',
    isCommentExamineOpen: false,
    isCommentSensiWordOpen: false,
    logo: '',
    mail: '',
    name: '',
    zhihuHomepage: '',
  };
};
