import { useStore } from '@/store';
import type { CommitOptions } from 'vuex';
import type { RootMutations } from '@/store/types/types-helper';
import type { GetFnParametersAndReturnType, FnMapper } from '@/hooks/store-hooks/types-helper';

//  重载定义
// 方式 1：传数组（返回 Pick 工具函数）
function useMutations<K extends keyof RootMutations>(
  keys: K[]
): Pick<FnMapper<'Mutations', RootMutations>, K>;

// 方式 2：传别名映射（返回别名类型）
function useMutations<M extends Record<string, keyof RootMutations>>(
  keys: M
): {
  [K in keyof M]: GetFnParametersAndReturnType<'Mutations', RootMutations[M[K]]>;
};

// 实现

function useMutations(keys: (keyof RootMutations)[] | Record<string, keyof RootMutations>) {
  const store = useStore();
  const result: Record<string, any> = {};

  if (Array.isArray(keys)) {
    keys.forEach((key) => {
      result[key as string] = (payload?: any, options?: CommitOptions) =>
        store.commit(key as keyof RootMutations, payload, options);
    });
  } else {
    Object.entries(keys).forEach(([alias, key]) => {
      result[alias] = (payload?: any, options?: CommitOptions) =>
        store.commit(key, payload, options);
    });
  }

  return result;
}

/**
 * 含有payload的mutation使用时，不传会报错
 * 定义时未定义的则为可选，undefined
 *
 */
export default useMutations;
