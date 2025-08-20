import { ActionContext } from 'vuex';
import { Mutations_Const } from '@/store/modules/root/const';

type RootState = {
  version: string;
  adminToken: string;
  theme: string;
};

type GettersInRoot = Record<string, (...args: any[]) => any>;

type MutationsInRoot = {
  [Mutations_Const.SET_ADMIN_TOKEN](state: RootState, token: string): void;
  [Mutations_Const.SET_THEME](
    state: RootState,
    payload: { theme: string; ignoreLocal: boolean }
  ): void;
};

type ActionsInRoot = {
  fn(context: ActionContext<RootState, RootState>): void;
};

export { RootState, GettersInRoot, MutationsInRoot, ActionsInRoot };
