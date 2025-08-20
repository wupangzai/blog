import type {
  RootState,
  MutationsInRoot,
  ActionsInRoot,
  GettersInRoot,
} from '@/store/modules/root/types';
import { Mutations_Const } from '@/store/modules/root/const';

/**
 * root 模块不会有很多数据，故不拆分成单一文件，优先使用commonModule
 */
const rootState: RootState = {
  version: 'v2.0.0',
  adminToken: '',
  theme: 'light',
};

const gettersInRoot: GettersInRoot = {};

const mutationsInRoot: MutationsInRoot = {
  [Mutations_Const.SET_ADMIN_TOKEN](state, payload: string) {
    state.adminToken = payload;
  },
  [Mutations_Const.SET_THEME](state, payload: string) {
    if (payload === 'admin') {
      console.log('[ 456787 ] >', 456787);
      state.theme = 'ligth';
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add('light');
      return;
    }
    const theme = localStorage.getItem('theme') || payload;
    state.theme = theme;
    document.documentElement.classList.add(theme);
  },
};

const actionsInRoot: ActionsInRoot = {
  fn(context) {
    console.log(context.state, context.rootState);
  },
};

export { rootState, gettersInRoot, mutationsInRoot, actionsInRoot };
