<template>
  <div class="operation-avatar">
    <el-dropdown placement="bottom">
      <img src="@/assets/imgs/avatar.jpg" alt="" />
      <template #dropdown>
        <el-dropdown-menu v-if="props.isShowDropDown">
          <el-dropdown-item v-for="(action, key) in actionsMapList" :key="key">
            <div class="action-item">
              <el-icon><component :is="action.icon" /></el-icon>
              <span>{{ action.label }}</span>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { Monitor, Switch } from '@element-plus/icons-vue';
const actionsMapList = [
  {
    icon: Monitor,
    label: '进入后台',
  },
  {
    icon: Switch,
    label: '退出登录',
  },
];

interface Props {
  isShowDropDown?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isShowDropDown: false,
});
</script>

<style lang="less" scoped>
.operation-avatar {
  & img {
    cursor: pointer;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 12px;
  }

  .action-item {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
::v-deep(.el-dropdown-menu__item) {
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--el-color-info-light-9);
    color: inherit;
  }
}
</style>
