<template>
  <el-form class="add-tag-dialog-content">
    <el-form-item :error="tags.errMsg">
      <el-tag
        v-for="tag in tags.value"
        :key="tag"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)"
      >
        {{ tag }}
      </el-tag>

      <el-input
        class="input"
        v-if="inputVisible"
        ref="InputRef"
        v-model="inputValue"
        size="small"
        @keyup.enter="handleInputConfirm"
        @blur="handleInputConfirm"
      />
      <el-button v-else class="button-new-tag" size="small" @click="showInput">
        + New Tag
      </el-button>
    </el-form-item>

    <el-form-item class="actions">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import type { InputInstance } from 'element-plus';
import { Form, useRule } from '@/hooks/form-hooks';
import { ref, nextTick } from 'vue';

// const input = useRule('');

const inputValue = ref('');
const inputVisible = ref(false);
const InputRef = ref<InputInstance>();

const tags = useRule<string[]>([]);

const handleClose = (tag: string) => {
  tags.value.value.splice(tags.value.value.indexOf(tag), 1);
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};

const handleInputConfirm = (e: Event) => {
  e.preventDefault();
  if (inputValue.value) {
    tags.value.value.push(inputValue.value);
  }
  inputVisible.value = false;
  inputValue.value = '';
};

const emits = defineEmits<{
  (e: 'update:visible', closeType: string, resolveValue?: string[]): void;
}>();

function close() {
  emits('update:visible', 'close');
}

async function submit() {
  const isValid = await Form.validateRules(tags.value);
  if (isValid) {
    emits('update:visible', 'confirm', tags.value.value);
  }
}
</script>

<style lang="less" scoped>
.add-tag-dialog-content {
  padding-top: 36px;
  :deep(.el-form-item__content) {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  :deep(.actions .el-form-item__content) {
    width: 100%;
    margin-left: auto;
    justify-content: end;
    margin-top: 36px;
  }

  .input {
    width: 100px;
  }
}
</style>
