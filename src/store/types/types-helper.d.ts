import { CommitOptions, DispatchOptions } from "vuex";

// 将模块化的Getters 映射为带模块名字的字面量：commonModule/name
type NamespacedGetters<ModuleName extends string, G> = {
  [K in keyof G as `${ModuleName}/${string & K}`]: ReturnType<G[K]>;
};

// 将模块化的Actions/Mutations映射为带模块名的字面量：commonModule/INCREMENT
type NameSpacedActionsOrMutations<
  ModuleName extends string,
  AllTypes extends (...args: any[]) => any
> = {
  [K in keyof AllTypes as `${ModuleName}/${K}`]: AllTypes[K];
};

type StoreTypes = "Actions" | "Mutations";
type GetTypesOptions<T extends StoreTypes> = T extends Extract<
  StoreTypes,
  "Mutations"
>
  ? CommitOptions
  : DispatchOptions;

// 维护类型，根据payload是否传值定义
type GetParametersTypes<Type extends StoreTypes, Fn> = Parameters<Fn> extends [
  any,
  infer P
]
  ? undefined extends P
    ? [payload?: undefined, options?: GetTypesOptions<Type>]
    : [payload: P, options?: GetTypesOptions<Type>]
  : [payload?: undefined, options?: GetTypesOptions<Type>];

// 增强Store的commit和dispatch类型推导
type EnhanceStoreTypes<
  Type extends StoreTypes,
  T extends Record<string, (...args: any[]) => any>
> = <K extends keyof T>(
  type: K,
  ...args: GetParametersTypes<Type, T[K]>
) => ReturnType<T[K]>;

import { State as CommonState } from "@/store/modules/common/state";
type ModuleStates = {
  commonModule: CommonState;
  // otherModule: OtherState;
};

import { Getters as CommonGetters } from "@/store/modules/common/getters";
import { GettersInRoot } from "@/store/modules/root/types";
type RootGetters = NamespacedGetters<"commonModule", CommonGetters> &
  GettersInRoot;

import { Mutations as CommonMutations } from "@/store/modules/common/mutations";
import { MutationsInRoot } from "@/store/modules/root/types";

type RootMutations = NameSpacedActionsOrMutations<
  "commonModule",
  CommonMutations
> &
  MutationsInRoot;
type RootCommit = EnhanceStoreTypes<"Mutations", RootMutations>;

import { Actions as CommonActions } from "@/store/modules/common/actions";
import { ActionsInRoot } from "@/store/modules/root/types";

type RootActions = NameSpacedActionsOrMutations<"commonModule", CommonActions> &
  ActionsInRoot;
type RootDispatch = EnhanceStoreTypes<"Actions", RootActions>;

export {
  ModuleStates,
  RootGetters,
  RootCommit,
  RootMutations,
  RootDispatch,
  RootActions,
  StoreTypes,
  GetTypesOptions,
};
