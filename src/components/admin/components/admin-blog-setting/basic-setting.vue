<template>
  <div class="basic-setting">
    <el-form label-width="180">
      <el-form-item label="博客名称" :error="name.errMsg" :required="name.required">
        <el-input v-model="name.value"></el-input>
      </el-form-item>

      <el-form-item label="作者名" :error="author.errMsg" :required="author.required">
        <el-input v-model="author.value"></el-input>
      </el-form-item>

      <el-form-item label="博客 LOGO" :error="logo.errMsg" :required="logo.required">
        <upload v-model="logo.value" v-bind="uploadOptions" />
      </el-form-item>

      <el-form-item label="博客 LOGO" :error="avatar.errMsg" :required="avatar.required">
        <upload v-model="avatar.value" v-bind="uploadOptions" />
      </el-form-item>

      <el-form-item label="介绍语" :error="introduction.errMsg" :required="introduction.required">
        <el-input v-model="introduction.value" type="textarea" :row="5"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { useRule } from '@/hooks/form-hooks';
import upload from '@/components/common/upload/index.vue';
import type { AdminBlogSettingType } from '@/api/types';
import { watch } from 'vue';

interface Props {
  blogSettingDetail: AdminBlogSettingType.BlogSettingDetail;
}

const uploadOptions = {
  uploadHeight: 100,
  uploadWidth: 100,
  closeSize: 16,
  reUploadSize: 40,
  showTip: false,
};

const props = defineProps<Props>();

const name = useRule('');

const author = useRule('');

const logo = useRule('');

const avatar = useRule('');

const introduction = useRule('');

type Key = Extract<
  keyof AdminBlogSettingType.BlogSettingDetail,
  'name' | 'author' | 'logo' | 'avatar' | 'introduction'
>;
const rulesMap: Record<Key, ReturnType<typeof useRule>> = {
  name,
  author,
  logo,
  avatar,
  introduction,
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

<style lang="less" scoped></style>
