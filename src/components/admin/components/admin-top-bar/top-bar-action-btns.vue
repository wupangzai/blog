<template>
  <div class="top-bar-action-btns">
    <div class="btns-group">
      <el-tooltip v-for="(btn, index) in btnMapList" :key="index" :content="btn.tooltip">
        <el-icon class="icon-class" @click="btn.callback">
          <component :is="btn.icon" />
        </el-icon>
      </el-tooltip>
    </div>
    <el-dropdown placement="bottom">
      <div class="user-info">
        <img :src="profile.avatar" alt="" />
        <div>{{ adminUserInfo.username }}</div>
        <el-icon>
          <arrow-down />
        </el-icon>
      </div>

      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="(option, index) in dropOptionList"
            :key="index"
            @click="option.callback"
          >
            {{ option.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { Refresh, Monitor, FullScreen, ArrowDown } from '@element-plus/icons-vue';
import { useCookie, useStates } from '@/hooks';
import { useRouter } from 'vue-router';
import { useFullscreen } from '@/hooks';

const { adminUserInfo, profile } = useStates('commonModule', ['adminUserInfo', 'profile']);

const btnMapList = [
  {
    tooltip: '刷新',
    icon: Refresh,
    callback: reload,
  },
  {
    tooltip: '跳转前台',
    icon: Monitor,
    callback: goFrontEnd,
  },
  {
    tooltip: '全屏',
    icon: FullScreen,
    callback: changeToFullScreen,
  },
];

function reload() {
  window.location.reload();
}

const router = useRouter();
function goFrontEnd() {
  router.replace('/');
}

const fullScreen = useFullscreen();
function changeToFullScreen() {
  fullScreen.toggle();
}

const dropOptionList = [
  {
    label: '修改密码',
    callback: () => ({}),
  },
  {
    label: '退出登录',
    callback: loginout,
  },
];

const authorizationCookie = useCookie('Authorization');
function loginout() {
  authorizationCookie.remove();
  router.replace('/login');
}
</script>

<style lang="less" scoped>
.top-bar-action-btns {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .btns-group {
    height: 100%;
    display: flex;
    flex: 1;

    .icon-class {
      flex: 1;
      height: 100%;
      margin: auto;
      cursor: pointer;
      &:hover {
        background-color: #e3e5e9;
      }
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    margin-right: 16px;
    margin-left: 8px;
    gap: 6px;
    font-size: 14px;
    color: #374151;
    cursor: pointer;

    img {
      width: 25px;
      height: 25px;
      border-radius: 50%;
    }
  }
}

.el-dropdown .user-info:focus {
  outline: none !important;
}
</style>
