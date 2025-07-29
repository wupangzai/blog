<template>
  <div class="admin-blog-setting">
    <setting-container :title="'基础设置'">
      <template #form>
        <basic-setting :blog-setting-detail="blogSettingDetail" ref="basicForm" />
      </template>
    </setting-container>
    <setting-container :title="'第三方平台设置'">
      <template #form>
        <other-platform-setting :blog-setting-detail="blogSettingDetail" ref="otherForm" />
      </template>
    </setting-container>
    <setting-container :title="'评论设置'">
      <template #form>
        <comment-setting :blog-setting-detail="blogSettingDetail" ref="commentForm" />
      </template>
    </setting-container>
    <div class="action">
      <el-button @click="submit" class="submit" type="primary">保存</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import settingContainer from './setting-container.vue';
import basicSetting from './basic-setting.vue';
import API from '@/api';
import { onMounted, ref } from 'vue';
import type { AdminBlogSettingType } from '@/api/types';
import APIConst from '@/api/default-const';
import { Form } from '@/hooks/form-hooks';
import otherPlatformSetting from './other-platform-setting.vue';
import commentSetting from './comment-setting.vue';
import { ElNotification } from 'element-plus';

const blogSettingDetail = ref<AdminBlogSettingType.BlogSettingDetail>(
  APIConst.AdminBlogSettingConst.getDefaultBlogSettingDetail()
);
async function getBlogSettingDetail() {
  const res = await API.AdminBlogSetting.getBlogSettingDetail();
  if (res) {
    blogSettingDetail.value = res.data;
  }
}

const basicForm = ref<InstanceType<typeof basicSetting> | null>(null);
const otherForm = ref<InstanceType<typeof otherPlatformSetting> | null>(null);
const commentForm = ref<InstanceType<typeof commentSetting> | null>(null);

async function submit() {
  const { name, author, logo, avatar, introduction } = basicForm.value!;

  const { githubHomepage, giteeHomepage, zhihuHomepage, csdnHomepage } = otherForm.value!;

  const { isCommentSensiWordOpen, isCommentExamineOpen, mail } = commentForm.value!;

  const dynamicFileds = [githubHomepage, giteeHomepage, zhihuHomepage, csdnHomepage].filter(
    (item) => item.required
  );

  const fieldsNeedValidate = [
    name,
    author,
    logo,
    avatar,
    introduction,

    ...dynamicFileds,

    isCommentSensiWordOpen,
    isCommentExamineOpen,
    mail,
  ];

  const isValid = await Form.validateRules(...fieldsNeedValidate);

  const payload = {
    name: name.value,
    author: author.value,
    logo: logo.value,
    avatar: avatar.value,
    introduction: introduction.value,
    githubHomepage: githubHomepage.value,
    giteeHomepage: giteeHomepage.value,
    zhihuHomepage: zhihuHomepage.value,
    csdnHomepage: csdnHomepage.value,
    isCommentSensiWordOpen: isCommentSensiWordOpen.value,
    isCommentExamineOpen: isCommentExamineOpen.value,
    mail: mail.value,
  } as AdminBlogSettingType.BlogSettingDetail;

  if (isValid) {
    const success = (await API.AdminBlogSetting.updateSetting(payload))?.success;

    if (success) {
      ElNotification({
        message: '保存成功',
        type: 'success',
      });
    }
  }
}

onMounted(() => {
  getBlogSettingDetail();
});
</script>

<style lang="less" scoped>
.admin-blog-setting {
  padding: 20px !important;
  width: 100%;
  height: 900px;

  .action {
    background-color: #fff;
    padding: 36px 0;
  }
  .submit {
    margin-left: 140px;
  }
}
</style>
