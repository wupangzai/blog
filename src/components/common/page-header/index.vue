<template>
  <el-header class="page-header">
    <header-content>
      <template #content-pic>
        <operation-avatar />
      </template>

      <template #content-title>
        <div class="content-title">{{ props.contentTitle }}</div>
      </template>

      <template #content-btn>
        <content-btns :btn-names="props.btnNames" @change-active-btn="changeActiveBtn" />
      </template>

      <template #content-right>
        <div class="content-right">
          <content-operations v-model="switchChecked"></content-operations>
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

interface Props {
  contentTitle?: string;
  btnNames?: DefaultBtnsList[];
}

const props = withDefaults(defineProps<Props>(), {
  contentTitle: '就是会⑧⑤②的博客',
  btnNames: () => defaultBtnsList,
});

function changeActiveBtn(name: string) {
  console.log('[ name ] >', name);
}

const switchChecked = ref(false);
</script>

<style lang="less" scoped>
.page-header {
  position: sticky;
  top: 0;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 68px;

  .content-title {
    font-weight: 600;
  }

  .content-right {
    width: 300px;
  }
}
</style>
