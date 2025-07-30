<template>
  <div class="other-platform-setting">
    <el-form label-width="180">
      <el-form-item label="敏感词过滤" class="form-row">
        <el-switch
          v-model="isCommentSensiWordOpen.value"
          inline-prompt
          :active-icon="Check"
          :inactive-icon="Close"
        ></el-switch>
        <el-alert type="info" show-icon :closable="false" class="alert">
          开启后，系统自动对发表的每条评论进行敏感词过滤
        </el-alert>
      </el-form-item>

      <el-form-item label="开启审核" class="form-row">
        <el-switch
          v-model="isCommentExamineOpen.value"
          inline-prompt
          :active-icon="Check"
          :inactive-icon="Close"
        ></el-switch>
        <el-alert type="info" show-icon :closable="false" class="alert">
          开启后，评论需要博主后台审核通过后，才会展示出来
        </el-alert>
      </el-form-item>

      <el-form-item
        label="博主邮箱"
        :error="mail.errMsg"
        :required="mail.required"
        class="form-row"
      >
        <el-input v-model="mail.value"></el-input>
        <el-alert type="info" show-icon :closable="false" class="alert">
          当被评论后，用于主动发送邮件通知博主
        </el-alert>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { useRule } from '@/hooks/form-hooks';
import type { AdminBlogSettingType } from '@/api/types';
import { watch } from 'vue';
import { Close, Check } from '@element-plus/icons-vue';

interface Props {
  blogSettingDetail: AdminBlogSettingType.BlogSettingDetail;
}

const props = defineProps<Props>();

const isCommentSensiWordOpen = useRule(false);

const isCommentExamineOpen = useRule(false);

const mail = useRule('');

type Key = Extract<
  keyof AdminBlogSettingType.BlogSettingDetail,
  'isCommentSensiWordOpen' | 'isCommentExamineOpen' | 'mail'
>;
const rulesMap: Record<Key, ReturnType<typeof useRule>> = {
  isCommentSensiWordOpen,
  isCommentExamineOpen,
  mail,
};

watch(
  () => props.blogSettingDetail,
  (newVal) => {
    const keyList = Object.keys(newVal) as Array<Key>;

    keyList.forEach((key) => {
      // 动态赋值
      if (rulesMap[key]) {
        rulesMap[key].value.value = newVal[key];
      }
    });
  },
  { immediate: true }
);

defineExpose({
  ...rulesMap,
});
</script>

<style lang="less" scoped>
.form-row {
  display: flex;
  .alert {
    width: 600px;
    height: 36px;
    font-size: 12px;
    background-color: transparent;
    padding-left: 0;

    :deep(i) {
      margin-right: 0;
    }
    :deep(svg) {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
