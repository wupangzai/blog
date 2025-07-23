import { State } from '@/store/modules/common/state';
import { ActionContext } from 'vuex';
import { Mutations_Const } from '@/store/modules/root/const';

type RootState = {
  version: string;
  adminToken: string;
  commonModule: State; // 让ts推导安全检测，如store.state.commonModule.xxx
};

type GettersInRoot = Record<string, (...args: any[]) => any>;

type MutationsInRoot = {
  [Mutations_Const.SET_ADMIN_TOKEN](state: RootState, token: string): void;
};

type ActionsInRoot = {
  fn(context: ActionContext<RootState, RootState>): void;
};

export { RootState, GettersInRoot, MutationsInRoot, ActionsInRoot };
