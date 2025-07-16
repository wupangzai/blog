import type { MutationTree } from 'vuex';
import type { State } from './state';
import { INCREMENT, DECREMENT } from './mutation-types';

type Mutations = {
  [INCREMENT](state: State, payload: number): number;
  [DECREMENT](state: State): void;
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
};

export { mutations };
export type { Mutations };
