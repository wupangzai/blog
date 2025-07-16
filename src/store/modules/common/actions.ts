import type { State } from './state';
import type { ActionContext as VuexActionContext, ActionTree } from 'vuex';
import type { RootState } from '@/store/modules/root/types';
import { INCREMENT_ACTION, DECREMENT_ACTION } from './actions-types';

type CommonActionContext = VuexActionContext<State, RootState>;

type Actions = {
  [INCREMENT_ACTION](context: CommonActionContext, payload: string): void;
  [DECREMENT_ACTION](): string;
};

const actions: ActionTree<State, RootState> & Actions = {
  async [INCREMENT_ACTION]() {},
  [DECREMENT_ACTION]() {
    return '123';
  },
};

export { actions };
export type { Actions };
