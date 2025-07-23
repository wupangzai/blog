<template>
  <el-icon>
    <component v-if="iconComponent" :is="iconComponent" class="menu-icon" />
  </el-icon>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { iconMap } from '@/components/admin/components/admin-menu/const';

const props = defineProps<{
  icon?: string;
}>();

const iconComponent = computed(() => {
  if (!props.icon) return null;
  return iconMap[props.icon as keyof typeof iconMap] || null;
});
</script>

<style scoped>
.menu-icon {
  font-size: 18px;
  width: 1em;
  height: 1em;
  display: inline-block;
  margin-right: 6px;
}
</style>
