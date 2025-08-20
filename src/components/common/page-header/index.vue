<template>
  <el-header class="page-header">
    <header-content>
      <template #content-pic>
        <operation-avatar :avatar="profile.avatar" />
      </template>

      <template #content-title>
        <div class="content-title">{{ profile.name }}</div>
      </template>

      <template #content-btn>
        <content-btns :btn-names="props.btnNames" @change-active-btn="changeActiveBtn" />
      </template>

      <template #content-right>
        <div class="content-right">
          <content-operations v-model="switchChecked" :avatar="profile.avatar"></content-operations>
        </div>
      </template>
    </header-content>
  </el-header>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { DefaultBtnsList } from '@/components/common/page-header/const';

import { defaultBtnsList } from '@/components/common/page-header/const';
import headerContent from './header-content.vue';
import contentBtns from './content-btns.vue';
import contentOperations from './content-operations/content-operations.vue';
import operationAvatar from './content-operations/operation-avatar.vue';
import { useRouter } from 'vue-router';
import { useCrtlKArticleSearch, useStates } from '@/hooks';

interface Props {
  btnNames?: DefaultBtnsList[];
}

const props = withDefaults(defineProps<Props>(), {
  btnNames: () => defaultBtnsList,
});

const { profile } = useStates('commonModule', ['profile']);

const router = useRouter();
function changeActiveBtn(path: string) {
  router.push(path);
}

useCrtlKArticleSearch();

const switchChecked = ref(false);
</script>

<style lang="less" scoped>
.page-header {
  position: sticky;
  top: 0;
  background-color: var(--custom-header-bg-color);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 68px;
  z-index: 999;

  .content-title {
    font-weight: 600;
  }

  .content-right {
    width: 300px;
  }
}
</style>
