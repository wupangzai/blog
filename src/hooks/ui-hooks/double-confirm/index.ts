interface confirmOption {
  content: string;
  title?: string;
  type?: messageType;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

const defaultOption: confirmOption = {
  content: '',
  title: '温馨提示',
  type: 'warning',
  confirmButtonText: '确定',
  cancelButtonText: '取消',
};

import { ElMessageBox } from 'element-plus';
import type { messageType } from 'element-plus';

export async function useDoubleConifrm(option: confirmOption) {
  const optionsAfterMerge = { ...defaultOption, ...option };
  const type = await ElMessageBox.confirm(optionsAfterMerge.content, optionsAfterMerge.title, {
    confirmButtonText: optionsAfterMerge.confirmButtonText,
    cancelButtonText: optionsAfterMerge.cancelButtonText,
    type: optionsAfterMerge.type,
  });

  return type;
}
