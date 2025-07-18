import type { GetterTree } from 'vuex';
import type { State } from './state';
import type { RootState } from '@/store/modules/root/types';

// Getters 类型
type Getters = {
  test(): Record<string, Array<number>>;
};

const getters: GetterTree<State, RootState> & Getters = {
  test() {
    const a = { a: [1] };
    return a;
  },
};

export { getters };
export type { Getters };
