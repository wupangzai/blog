import type { MutationTree } from 'vuex';
import type { State } from './state';
import { INCREMENT, DECREMENT, SET_PROFILE } from './mutation-types';
import type { Profile } from '@/api/types';

type Mutations = {
  [INCREMENT](state: State, payload: number): number;
  [DECREMENT](state: State): void;
  [SET_PROFILE](state: State, payload: Profile.ProfileDetail): void;
};

const mutations: MutationTree<State> & Mutations = {
  [INCREMENT](state, payload) {
    state.number += payload;
    console.log('mupayload', state.number);
    return 100;
  },

  [DECREMENT](state) {
    state.number--;
  },

  [SET_PROFILE](state, payload) {
    state.profile = payload;
  },
};

export { mutations };
export type { Mutations };
