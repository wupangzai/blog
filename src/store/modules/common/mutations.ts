import type { MutationTree } from 'vuex';
import type { State } from './state';
import { SET_PROFILE } from './mutation-types';
import type { Profile } from '@/api/types';

type Mutations = {
  [SET_PROFILE](state: State, payload: Profile.ProfileDetailData): void;
};

const mutations: MutationTree<State> & Mutations = {
  [SET_PROFILE](state, payload) {
    state.profile = payload;
  },
};

export { mutations };
export type { Mutations };
