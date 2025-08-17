<template>
  <div class="write-article">
    <div class="top-bar">
      <div class="title">{{ componentTitle }}</div>
      <div class="action">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">{{ confirmText }}</el-button>
      </div>
    </div>

    <el-form label-position="top">
      <el-form-item label="标题" :error="title.errMsg" :required="title.required">
        <el-input v-model="title.value" size="large" />
      </el-form-item>

      <el-form-item label="内容" :error="content.errMsg" :required="content.required">
        <md-editor
          v-model="content.value"
          @onUploadImg="uploadImg"
          :preview="true"
          :editable="true"
          :preview-only="false"
          :toolbars="[
            'bold', // 粗体
            'underline', // 下划线
            'italic', // 斜体
            'strikeThrough', // 删除线
            'title', // 标题（H1~H6）
            'image', // 图片上传
            'sub', // 下标
            'sup', // 上标
            'quote', // 引用
            'unorderedList', // 无序列表
            'orderedList', // 有序列表
            'task', // 任务列表
            'codeRow', // 行内代码
            'code', // 代码块
            'link', // 超链接
            'table', // 表格
            'mermaid', // Mermaid 图表
            'katex', // 数学公式
            'revoke', // 撤销
            'next', // 重做
            'save', // 保存
            'prettier', // 格式化
            'pageFullscreen', // 页面全屏（仅编辑器区域）
            'fullscreen', // 整个页面全屏
            'preview', // 切换预览
            'htmlPreview', // HTML 预览
            'catalog', // 目录（滚动用）
            '-',
            '=', // 分隔符（竖线/换行）
          ]"
          preview-theme="cyanosis"
          :code-foldable="false"
          :code-expand="true"
          :code-theme="'github'"
          language="zh-CN"
          style="height: 60vh"
          :show-toc="true"
          toc-nav-position="right"
        />
      </el-form-item>

      <el-form-item label="封面" :error="cover.errMsg" :required="cover.required">
        <upload v-model="cover.value" v-bind="uploadOptions" />
      </el-form-item>

      <el-form-item label="摘要" :error="summary.errMsg" :required="summary.required">
        <el-input v-model="summary.value" size="large" />
      </el-form-item>

      <el-form-item label="分类" :error="categoryId.errMsg" :required="categoryId.required">
        <el-select v-model="categoryId.value" size="large" placeholder="请选择">
          <el-option
            v-for="item in categorySelectList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="标签" :error="tags.errMsg" :required="tags.required">
        <el-select
          v-model="tags.value"
          size="large"
          placeholder="请选择"
          multiple
          filterable
          allow-create
        >
          <el-option
            v-for="item in tagSelectList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { useRule } from '@/hooks/form-hooks';
import { computed, ref, onMounted } from 'vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import upload from '@/components/common/upload/index.vue';
import type { AdminArticleType } from '@/api/types';
import API from '@/api';
import { Form } from '@/hooks/form-hooks';

const uploadOptions = {
  uploadHeight: 100,
  uploadWidth: 200,
  closeSize: 16,
  reUploadSize: 40,
  showTip: false,
};

interface Props {
  type?: string;
  id?: number;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
});

const isAddArticle = computed(() => props.type === 'add');
const componentTitle = computed(() => (isAddArticle.value ? '写文章' : '编辑文章'));
const confirmText = computed(() => (isAddArticle.value ? '发布' : '保存'));

const title = useRule('');
const content = useRule('');
const cover = useRule('');
const summary = useRule('');
const categoryId = useRule<number | null>(null);
const tags = useRule<number[]>([]);

const categorySelectList = ref<AdminArticleType.AdminCategorySelectLsitItem[]>([]);
const tagSelectList = ref<AdminArticleType.AdminCategorySelectLsitItem[]>([]);

async function getSelectList() {
  categorySelectList.value = (await API.AdminArticle.getAdminCategorySelectLsit())?.data!;
  tagSelectList.value = (await API.AdminArticle.getAdminTagSelectLsit())?.data!;
}

async function getAdminArticleDetail() {
  if (isAddArticle.value) return;
  const res = (await API.AdminArticle.getAdminArticleDetail(props.id!))?.data;
  if (res) {
    title.value.value = res.title;
    content.value.value = res.content;
    cover.value.value = res.cover;
    summary.value.value = res.summary;
    categoryId.value.value = res.categoryId;
    console.log('[ res.tags ] >', res.tagIds);
    tags.value.value = [...res.tagIds!];
  }
}

const emits = defineEmits<{
  (
    e: 'update:visible',
    closeType: string,
    resolveValue?: AdminArticleType.PublishArticleApiPayload
  ): void;
}>();

function close() {
  emits('update:visible', 'close');
}

async function submit() {
  const filedsNeedValidate = [
    title.value,
    content.value,
    cover.value,
    summary.value,
    categoryId.value,
    tags.value,
  ];
  const isValid = await Form.validateRules(...filedsNeedValidate);
  if (isValid) {
    const resolveValue = {
      title: title.value.value,
      content: content.value.value,
      cover: cover.value.value,
      summary: summary.value.value,
      categoryId: categoryId.value.value,
      tags: tags.value.value,
    } as unknown as AdminArticleType.PublishArticleApiPayload;
    emits('update:visible', 'confirm', resolveValue);
  }
}

async function uploadImg(files: File[], callback: (urls: string[]) => void) {
  const uploadedUrls = await Promise.all(
    files.map(async (file) => {
      const res = await API.AdminWiki.adminUploadfile(file as any);
      return res?.data.url ?? '';
    })
  );

  callback(uploadedUrls);
}

onMounted(() => {
  getSelectList();
  getAdminArticleDetail();
});
</script>

<style lang="less" scoped>
:deep(.el-dialog__header) {
  height: 0;
}
.write-article {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  background-color: #fff;

  .top-bar {
    width: 100%;
    display: flex;
    height: 50px;
    justify-content: space-between;
    position: sticky;
    top: 0;
    left: 0;
    z-index: 99;
    background-color: #fff;

    .title {
      font-size: 16px;
      font-weight: 700;
    }
  }
}
</style>
