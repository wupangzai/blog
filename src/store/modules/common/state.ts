// State 类型
import type { Profile } from '@/api/types';

interface State {
  profile: Profile.ProfileDetailData;
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
};

export { state };
export type { State };
