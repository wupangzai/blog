// State 类型
import type { Profile } from '@/api/types';

interface State {
  number: number;
  name: string;
  test: string;

  profile: Profile.ProfileDetail;
}

const state: State = {
  number: 1,
  name: 'dingzhen',
  test: 'test',
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
