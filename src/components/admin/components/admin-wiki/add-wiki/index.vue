<template>
  <el-form class="add-wiki">
    <div class="add-wiki-form">
      <el-form-item :error="title.errMsg" label="标题" :required="title.required">
        <el-input placeholder="请输入知识库标题" size="large" v-model="title.value" />
      </el-form-item>
      <el-form-item :error="cover.errMsg" label="封面" :required="title.required">
        <el-upload
          class="upload"
          drag
          :limit="1"
          :auto-upload="false"
          v-model:file-list="file.value"
          :show-file-list="false"
          :on-change="handleChange"
        >
          <template #default>
            <div v-if="cover.value" class="preview-content">
              <img :src="cover.value" alt="" />
              <el-icon class="close-icon" @click="removeUploadFile"><Close /></el-icon>
              <el-icon class="reUpload-icon" :size="60"><RefreshRight /></el-icon>
            </div>
            <div class="upload-info" v-else>
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
            </div>
          </template>
          <template #tip>
            <div class="el-upload__tip">jpg/png files with a size less than 500kb</div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item :error="summary.errMsg" label="摘要" :required="title.required">
        <el-input
          v-model="summary.value"
          :rows="5"
          type="textarea"
          placeholder="请输入知识库摘要"
        />
      </el-form-item>
    </div>

    <el-form-item class="actions">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { UploadFilled, Close, RefreshRight } from '@element-plus/icons-vue';
import { useRule } from '@/hooks/form-hooks';
import type { UploadUserFile, UploadProps } from 'element-plus';
import { Form } from '@/hooks/form-hooks';
import type { AdminWikiType } from '@/api/types';
import API from '@/api';
interface Props {
  initValue: AdminWikiType.AdminWikiListItem;
}

const props = defineProps<Props>();

const title = useRule(props.initValue.title);

const file = useRule<UploadUserFile[]>([]);

const summary = useRule(props.initValue.summary);

const cover = useRule(props.initValue.cover);

// 监听文件变化
const handleChange: UploadProps['onChange'] = async (uploadFile) => {
  const uploadResult = await API.AdminWiki.adminUploadfile(uploadFile.raw);

  if (uploadResult?.success) {
    cover.value.value = uploadResult?.data.url;
  }
};

function removeUploadFile(e: Event) {
  e.stopPropagation();
  file.value.value.pop();
  cover.value.value = '';
}

const emits = defineEmits<{
  (e: 'update:visible', closeType: string, resolveValue?: any): void;
}>();

function close() {
  emits('update:visible', 'close');
}

async function submit() {
  const fieldsNeedvalidate = [title.value, cover.value, summary.value];
  const isValid = await Form.validateRules(...fieldsNeedvalidate);
  if (isValid) {
    const resolveValue = {
      cover: cover.value.value,
      summary: summary.value.value,
      title: title.value.value,
    };
    emits('update:visible', 'confirm', resolveValue);
  }
}
</script>

<style lang="less" scoped>
.add-wiki {
  padding-top: 36px;

  .add-wiki-form {
    padding: 0 20px;
  }

  :deep(.actions .el-form-item__content) {
    width: 100%;
    display: flex;
    justify-content: end;
    margin-top: 36px;
    padding: 0 20px;
  }

  .upload {
    width: 350px;

    .preview-content {
      height: 100%;
      &:hover .close-icon,
      .reUpload-icon {
        visibility: visible;
        z-index: 999;
      }

      &:hover {
        .close-icon,
        .reUpload-icon {
          visibility: visible;
          z-index: 999;
        }
      }
      .close-icon {
        visibility: hidden;
        position: absolute;
        background-color: #fff;
        right: 0;
        top: 0;
        width: 25px;
        height: 25px;
        border-bottom-left-radius: 8px;
      }

      .reUpload-icon {
        position: absolute;
        visibility: hidden;
        right: 50%;
        top: 50%;
        transform: translate(50%, -50%);
        color: var(--el-color-info);
      }
    }

    :deep(.el-upload) {
      position: relative;
      width: 100%;
      height: 200px;

      .el-upload-dragger {
        width: 100%;
        height: 100%;

        .upload-info {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      }
    }

    img {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
    }
  }
}
</style>
