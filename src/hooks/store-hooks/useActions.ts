import { useStore } from '@/store';
import type { DispatchOptions } from 'vuex';
import type { RootActions } from '@/store/types/types-helper';
import type { GetFnParametersAndReturnType, FnMapper } from '@/hooks/store-hooks/types-helper';

// 重载定义
// 1. 数组形式，返回 Pick
function useActions<K extends keyof RootActions>(
  keys: K[]
): Pick<FnMapper<'Actions', RootActions>, K>;

// 2. 别名映射形式，返回对应别名映射
function useActions<M extends Record<string, keyof RootActions>>(
  keys: M
): {
  [K in keyof M]: GetFnParametersAndReturnType<'Actions', RootActions[M[K]]>;
};

// 实现
function useActions(keys: (keyof RootActions)[] | Record<string, keyof RootActions>) {
  const store = useStore();
  const result: Record<string, any> = {};

  if (Array.isArray(keys)) {
    keys.forEach((key) => {
      result[key as string] = (payload?: any, options?: DispatchOptions) =>
        store.dispatch(key as keyof RootActions, payload, options);
    });
  } else {
    Object.entries(keys).forEach(([alias, key]) => {
      result[alias] = (payload?: any, options?: DispatchOptions) =>
        store.dispatch(key, payload, options);
    });
  }

  return result;
}
export default useActions;
