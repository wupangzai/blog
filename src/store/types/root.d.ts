import { Store as VuexStore } from "vuex";
import {
  RootGetters,
  RootCommit,
  RootDispatch,
} from "@/store/types/types-helper";

interface EnhancedStore
  extends Omit<VuexStore<RootState>, "getters" | "commit" | "dispatch"> {
  getters: RootGetters;
  commit: RootCommit;
  dispatch: RootDispatch;
}

export { EnhancedStore };
