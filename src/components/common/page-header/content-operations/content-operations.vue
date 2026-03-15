<template>
  <div class="content-operations">
    <operation-theme />
    <operation-search />
    <operation-avatar class="header-dropdown-avatar" :is-show-drop-down="true" v-bind="$attrs" />
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

@media (max-width: 960px) {
  .content-operations {
    justify-content: center;
    gap: 12px;
  }

  .header-dropdown-avatar {
    display: none;
  }
}
</style>
