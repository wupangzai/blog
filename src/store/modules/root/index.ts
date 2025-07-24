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
};

const gettersInRoot: GettersInRoot = {};

const mutationsInRoot: MutationsInRoot = {
  [Mutations_Const.SET_ADMIN_TOKEN](state, payload: string) {
    state.adminToken = payload;
  },
};

const actionsInRoot: ActionsInRoot = {
  fn(context) {
    console.log(context.state, context.rootState);
  },
};

export { rootState, gettersInRoot, mutationsInRoot, actionsInRoot };
