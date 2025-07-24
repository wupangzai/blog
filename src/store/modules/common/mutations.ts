import type { MutationTree } from 'vuex';
import type { State } from './state';
import { SET_PROFILE, SET_ADMIN_USERINFO } from './mutation-types';
import type { Profile, AdminUserType } from '@/api/types';

type Mutations = {
  [SET_PROFILE](state: State, payload: Profile.ProfileDetailData): void;
  [SET_ADMIN_USERINFO](state: State, payload: AdminUserType.AdminUserInfo): void;
};

const mutations: MutationTree<State> & Mutations = {
  [SET_PROFILE](state, payload) {
    state.profile = payload;
  },
  [SET_ADMIN_USERINFO](state, payload) {
    state.adminUserInfo = payload;
  },
};

export { mutations };
export type { Mutations };
