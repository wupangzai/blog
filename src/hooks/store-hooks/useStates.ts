import type { ComputedRef } from 'vue';
import type { RootState } from '@/store/modules/root/types';
import type { ModuleStates } from '@/store/types/types-helper';
import type { StateOrGettersMapper } from '@/hooks/store-hooks/types-helper';
import { computed } from 'vue';
import { useStore } from '@/store';

//  重载定义

// 根模块数组
function useStates<K extends keyof RootState>(keys: K[]): Pick<StateOrGettersMapper<RootState>, K>;

// 根模块别名
function useStates<M extends Record<string, keyof RootState>>(
  keys: M
): { [K in keyof M]: ComputedRef<RootState[M[K]]> };

// 模块命名空间数组
function useStates<N extends keyof ModuleStates, K extends keyof ModuleStates[N]>(
  namespace: N,
  keys: K[]
): Pick<StateOrGettersMapper<ModuleStates[N]>, K>;

// 模块命名空间别名
function useStates<N extends keyof ModuleStates, M extends Record<string, keyof ModuleStates[N]>>(
  namespace: N,
  keys: M
): { [K in keyof M]: ComputedRef<ModuleStates[N][M[K]]> };

//  实现体
function useStates(
  namespaceOrKeys:
    | keyof RootState
    | (keyof RootState)[]
    | Record<string, keyof RootState>
    | keyof ModuleStates,
  keysOrMaybeNothing?: any
) {
  const store = useStore();
  const result: Record<string, ComputedRef<any>> = {};

  if (
    Array.isArray(namespaceOrKeys) ||
    (typeof namespaceOrKeys === 'object' && namespaceOrKeys !== null)
  ) {
    // 根模块
    const keys = namespaceOrKeys;
    if (Array.isArray(keys)) {
      keys.forEach((key) => {
        result[key as string] = computed(() => store.state[key]);
      });
    } else {
      Object.entries(keys).forEach(([alias, key]) => {
        result[alias] = computed(() => store.state[key]);
      });
    }
  } else if (typeof namespaceOrKeys === 'string') {
    const namespace = namespaceOrKeys as keyof ModuleStates;
    const keys = keysOrMaybeNothing;

    if (Array.isArray(keys)) {
      keys.forEach((key) => {
        result[key as string] = computed(
          () => store.state[namespace][key as keyof ModuleStates[typeof namespace]]
        );
      });
    } else {
      Object.entries(keys).forEach(([alias, key]) => {
        result[alias] = computed(
          () => store.state[namespace][key as keyof ModuleStates[typeof namespace]]
        );
      });
    }
  }

  return result;
}

export default useStates;
