// State 类型
import type { Profile, AdminUserType } from '@/api/types';

interface State {
  profile: Profile.ProfileDetailData;
  adminUserInfo: AdminUserType.AdminUserInfo;
}

const state: State = {
  profile: {
    author: '',
    avatar: '',
    csdnHomepage: '',
    giteeHomepage: '',
    githubHomepage: '',
    introduction: '',
    logo: '',
    name: '',
    zhihuHomepage: '',
  },
  adminUserInfo: {
    username: '',
  },
};

export { state };
export type { State };
