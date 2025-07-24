import type { State } from './state';
import type { ActionContext as VuexActionContext, ActionTree } from 'vuex';
import type { RootState } from '@/store/modules/root/types';
import { GETPROFILE_ACTION, GETADMINUSERINFO_ACTION } from './actions-types';
import API from '@/api';

type CommonActionContext = VuexActionContext<State, RootState>;

type Actions = {
  [GETPROFILE_ACTION](context: CommonActionContext): void;
  [GETADMINUSERINFO_ACTION](context: CommonActionContext): void;
};

const actions: ActionTree<State, RootState> & Actions = {
  async [GETPROFILE_ACTION](context) {
    const profile = await API.profileDetail.getProfileDetail();
    context.commit('SET_PROFILE', profile!.data);
  },

  async [GETADMINUSERINFO_ACTION](context) {
    const adminUserInfo = await API.AdminUser.getAdminUserInfo();
    context.commit('SET_ADMIN_USERINFO', adminUserInfo!.data);
  },
};

export { actions };
export type { Actions };
