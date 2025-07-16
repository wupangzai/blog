import type { GetterTree } from 'vuex';
import type { State } from './state';
import type { RootState } from '@/store/modules/root/types';

// Getters 类型
type Getters = {
  total(state: State, getters: Getters): number;
  all(state: State): number;
  test(): Record<string, Array<number>>;
};

const getters: GetterTree<State, RootState> & Getters = {
  total(state, getters) {
    console.log('[ getters ] >', getters.all);

    return state.number + 100;
  },

  all(state) {
    return state.number + 200;
  },
  test() {
    const a = { a: [1] };
    return a;
  },
};

export { getters };
export type { Getters };
