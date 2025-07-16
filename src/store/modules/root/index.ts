import type {
  RootState,
  MutationsInRoot,
  ActionsInRoot,
  GettersInRoot,
} from '@/store/modules/root/types';

/**
 * root 模块不会有很多数据，故不拆分成单一文件，优先使用commonModule
 */
const rootState = {
  version: 'v2.0.0',
} as RootState;

const gettersInRoot: GettersInRoot = {
  name: () => 'dingzhenroot',
  a: () => 123,
};

const mutationsInRoot: MutationsInRoot = {
  fn(state, payload) {
    console.log('[ state ] >', state, payload);
  },
};

const actionsInRoot: ActionsInRoot = {
  fn(context) {
    console.log(context.state, context.rootState);
  },
};

export { rootState, gettersInRoot, mutationsInRoot, actionsInRoot };
