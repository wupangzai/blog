<template>
  <div class="upload-container">
    <el-upload
      class="custom-upload"
      :style="uploadWidthh"
      drag
      :limit="1"
      :auto-upload="false"
      :show-file-list="false"
      v-model:file-list="file"
      :on-change="handleChange"
    >
      <template #default>
        <div v-if="modelValue" class="preview-content">
          <img :src="modelValue" alt="" />
          <el-icon class="close-icon" @click="removeUploadFile" :size="props.closeSize"
            ><Close
          /></el-icon>
          <el-icon class="reUpload-icon" :size="props.reUploadSize"><RefreshRight /></el-icon>
        </div>
        <div class="upload-info" v-else>
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div v-if="showFileDropTip" class="el-upload__text">
            Drop file here or <em>click to upload</em>
          </div>
        </div>
      </template>
      <template #tip>
        <div class="el-upload__tip" v-if="props.showTip">
          {{ props.tip }}
        </div>
      </template>
    </el-upload>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { UploadFilled, Close, RefreshRight } from '@element-plus/icons-vue';
import type { UploadProps } from 'element-plus';
import API from '@/api';
interface Props {
  uploadWidth?: number;
  uploadHeight?: number;
  tip?: string;
  showTip?: boolean;
  closeSize?: number;
  reUploadSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
  uploadHeight: 250,
  uploadWidth: 350,
  closeSize: 25,
  reUploadSize: 60,
  showTip: false,
  tip: 'jpg/png files with a size less than 500kb',
});

const modelValue = defineModel<string>();

const uploadWidthh = computed(() => {
  return { width: `${props.uploadWidth}px`, height: `${props.uploadHeight}px` };
});

const showFileDropTip = computed(() => props.uploadHeight >= 250);

const file = ref([]);

function removeUploadFile(e: Event) {
  console.log('[ modelValue.value ] >', modelValue.value);

  e.stopPropagation();
  file.value.pop();
  modelValue.value = '';
}

const handleChange: UploadProps['onChange'] = async (uploadFile) => {
  const uploadResult = await API.AdminWiki.adminUploadfile(uploadFile.raw);

  if (uploadResult?.success) {
    modelValue.value = uploadResult?.data.url;
  }
};
</script>

<style lang="less" scoped>
.custom-upload {
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
    height: 100%;

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
</style>
