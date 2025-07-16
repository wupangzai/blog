import type { InjectionKey } from 'vue';
import type { EnhancedStore } from './types/root';
import type { RootState } from '@/store/modules/root/types';
import { createStore, Store as VuexStore, useStore as useBaseStore } from 'vuex';
import commonModule from './modules/common';
import { rootState, gettersInRoot, mutationsInRoot, actionsInRoot } from '@/store/modules/root';

const key: InjectionKey<VuexStore<RootState>> = Symbol(); // 创建一个具备类型安全的唯一注入 Key，用于在 Vue 组件中注入 Store 实例。

const store = createStore({
  state: () => rootState,

  mutations: mutationsInRoot, // TEST

  actions: actionsInRoot, // TEST

  getters: gettersInRoot,

  modules: {
    commonModule,
  },
}) as EnhancedStore;

function useStore(): EnhancedStore {
  return useBaseStore(key);
}

export { store, key, useStore };
