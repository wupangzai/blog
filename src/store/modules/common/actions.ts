import type { State } from './state';
import type { ActionContext as VuexActionContext, ActionTree } from 'vuex';
import type { RootState } from '@/store/modules/root/types';
import { INCREMENT_ACTION, DECREMENT_ACTION, GETPROFILE_ACTION } from './actions-types';
import API from '@/api';

type CommonActionContext = VuexActionContext<State, RootState>;

type Actions = {
  [INCREMENT_ACTION](context: CommonActionContext, payload: string): void;
  [DECREMENT_ACTION](): string;
  [GETPROFILE_ACTION](context: CommonActionContext): void;
};

const actions: ActionTree<State, RootState> & Actions = {
  async [INCREMENT_ACTION]() {},
  [DECREMENT_ACTION]() {
    return '123';
  },

  async [GETPROFILE_ACTION](context) {
    const profile = await API.profileDetail.getProfileDetail();
    context.commit('SET_PROFILE', profile);
  },
};

export { actions };
export type { Actions };
