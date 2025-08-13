<template>
  <div class="content-operations">
    <operation-theme />
    <operation-search />
    <operation-avatar :is-show-drop-down="true" v-bind="$attrs" />
  </div>
</template>

<script lang="ts" setup>
import operationTheme from './operation-theme.vue';
import operationSearch from './operation-search.vue';
import operationAvatar from './operation-avatar.vue';
</script>

<style lang="less" scoped>
.content-operations {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
