import { State } from "@/store/modules/common/state";
import { ActionContext } from "vuex";

type RootState = {
  version: string;
  commonModule: State; // 让ts推导安全检测，如store.state.commonModule.xxx
};

type GettersInRoot = {
  name(state: RootState): string;
  a: () => number;
};

type MutationsInRoot = {
  fn(state: RootState, payload: number): void;
};

type ActionsInRoot = {
  fn(context: ActionContext<RootState, RootState>): void;
};

export { RootState, GettersInRoot, MutationsInRoot, ActionsInRoot };
