<template>
  <el-form class="comment-detail" label-position="right" label-width="70">
    <el-form-item label="路由">
      <el-input v-model="routerUrl.value" size="large" :disabled="routerUrl.disabled" />
    </el-form-item>

    <el-form-item label="头像">
      <img :src="avatar.value" class="avatar" />
    </el-form-item>

    <el-form-item label="昵称">
      <el-input v-model="nickname.value" size="large" :disabled="nickname.disabled" />
    </el-form-item>

    <el-form-item label="评论内容">
      <el-input v-model="content.value" size="large" type="textarea" :disabled="content.disabled" />
    </el-form-item>

    <el-form-item label="网站">
      <el-input v-model="website.value" size="large" :disabled="website.disabled" />
    </el-form-item>

    <el-form-item label="邮箱">
      <el-input v-model="mail.value" size="large" :disabled="mail.disabled" />
    </el-form-item>

    <el-form-item label="发布时间">
      <el-input v-model="createTime.value" size="large" :disabled="createTime.disabled" />
    </el-form-item>

    <el-form-item label="发布时间">
      <el-tag :type="getTag(status.value).tagType">{{ getTag(status.value).label }}</el-tag>
    </el-form-item>

    <el-form-item label="原因">
      <el-input v-model="resaon.value" size="large" :disabled="resaon.disabled" />
    </el-form-item>

    <el-form-item class="actions">
      <el-button @click="close">退出</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import type { AdminCommentType } from '@/api/types';
import { useRule } from '@/hooks/form-hooks';
import { getTag } from './const';
import { onMounted } from 'vue';

interface Props {
  commentRow: AdminCommentType.AdminCommentListItem;
}

const props = defineProps<Props>();

const routerUrl = useRule(props.commentRow.routerUrl);

const avatar = useRule(props.commentRow.avatar);

const nickname = useRule(props.commentRow.nickname);

const content = useRule(props.commentRow.content);

const website = useRule(props.commentRow.website);

const mail = useRule(props.commentRow.mail);

const createTime = useRule(props.commentRow.createTime);

const status = useRule(props.commentRow.status);

const resaon = useRule(props.commentRow.reason);

function setFormItemDiasbled() {
  const formItemNeedDisabledList = [
    routerUrl,
    avatar,
    nickname,
    content,
    website,
    mail,
    createTime,
    status,
    resaon,
  ];

  formItemNeedDisabledList.forEach((item) => {
    item.value.disabled = true;
  });
}

onMounted(() => {
  setFormItemDiasbled();
});

const emits = defineEmits<{
  (e: 'update:visible', closeType: string, resolveValue?: string): void;
}>();

function close() {
  emits('update:visible', 'close');
}
</script>

<style lang="less" scoped>
.comment-detail {
  padding-top: 16px;
  :deep(.actions .el-form-item__content) {
    width: 100%;
    display: flex;
    justify-content: end;
    margin-top: 36px;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
</style>
