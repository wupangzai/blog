<template>
  <div class="admin-bread-crumb-item" :class="[{ active: isActiveRoute }]" @click="clickBreadCrumb">
    {{ props.adminBreadCrumbItem.label }}
    <el-icon class="hover-icon">
      <Close />
    </el-icon>
  </div>
</template>

<script lang="ts" setup>
import { Close } from '@element-plus/icons-vue';
import type { MenuListItem } from '@/components/admin/components/admin-menu/const';
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

interface Props {
  adminBreadCrumbItem: Pick<MenuListItem, 'name' | 'label'>;
}

const props = defineProps<Props>();

const modelValue = defineModel();

const isActiveRoute = computed(() => modelValue.value === props.adminBreadCrumbItem.name);

const router = useRouter();
function clickBreadCrumb() {
  modelValue.value = props.adminBreadCrumbItem.name;
  router.push({ name: props.adminBreadCrumbItem.name });
}

const route = useRoute();
watch(
  () => route.name,
  () => {
    modelValue.value = route.name;
  },
  { immediate: true }
);
</script>

<style lang="less" scoped>
.active {
  background-color: #409eff;
  color: #fff;

  pointer-events: none;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #fff;
  }
}

.admin-bread-crumb-item {
  padding: 0 20px;
  height: 32px;

  border: 1px solid #d8dce5;
  line-height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  border-radius: 3px;
  gap: 6px;
  cursor: pointer;

  &:hover {
    color: #409eff;
  }

  &:hover .hover-icon {
    opacity: 1;
    visibility: visible;
    width: 14px;
    height: 14px;

    &:hover {
      background-color: #a8abb2;
      color: #fff;
    }
  }

  .hover-icon {
    width: 0px;
    height: 0px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    border-radius: 50%;
    padding: 2px;
  }
}
</style>
