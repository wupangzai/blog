<template>
  <div class="operation-theme">
    <el-switch
      v-model="switchChecked"
      class="custom-switch"
      :style="switchVars"
      @change="changeTheme"
    >
      <template #active-action>
        <el-icon :color="getIconColor('Moon')"><Moon :class="getIconClass" /></el-icon>
      </template>
      <template #inactive-action>
        <el-icon :color="getIconColor('Sunny')"><Sunny /></el-icon>
      </template>
    </el-switch>
  </div>
</template>

<script lang="ts" setup>
import { useMutations } from '@/hooks';
import { Sunny, Moon } from '@element-plus/icons-vue';
import { computed, ref } from 'vue';

const theme = localStorage.getItem('theme');
const switchChecked = ref(theme === 'dark');

type Icon = 'Moon' | 'Sunny';
function getIconColor(icon: Icon) {
  return icon === 'Sunny' ? '#767676' : '#E1E1E1';
}

const getIconClass = computed(() => {
  return switchChecked.value ?? 'dark';
});

// 动态圆球颜色
const switchVars = computed(() => ({
  '--el-switch-button-color': switchChecked.value ? '#1A1A1A' : '#fff',
}));

const { SET_THEME } = useMutations(['SET_THEME']);

function changeTheme() {
  const theme = switchChecked.value ? 'dark' : 'light';
  SET_THEME({ theme, ignoreLocal: true });
}
</script>

<style lang="less" scoped>
.el-switch {
  --el-switch-border-color: #c4c4c4;
  --el-switch-on-color: #2f2f2f;
}

.dark {
  background-color: #1a1a1a;
  border-radius: 50%;
}

.custom-switch {
  // margin-right: 16px;
  :deep(.el-switch__action) {
    background-color: var(--el-switch-button-color);
  }
}
</style>
