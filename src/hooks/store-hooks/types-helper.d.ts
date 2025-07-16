import { ComputedRef } from "vue";
import { StoreTypes, GetTypesOptions } from "@/store/types/types-helper";
type GetFnParametersAndReturnType<
  Type extends StoreTypes,
  Fn
> = Parameters<Fn> extends [any, infer P]
  ? undefined extends P
    ? (payload?: undefined, options?: GetTypesOptions<Type>) => ReturnType<Fn>
    : (payload: P, options?: GetTypesOptions<Type>) => ReturnType<Fn>
  : (payload?: undefined, options?: GetTypesOptions<Type>) => ReturnType<Fn>;

type FnMapper<
  Type extends StoreTypes,
  T extends Record<string, (...args: any[]) => any>
> = {
  [K in keyof T]: GetFnParametersAndReturnType<Type, T[K]>;
};

type StateOrGettersMapper<T> = {
  [K in keyof T]: ComputedRef<T[K]>;
};

export { GetFnParametersAndReturnType, FnMapper, StateOrGettersMapper };
