<template>
  <div class="other-platform-setting">
    <el-form label-width="180">
      <el-form-item label="开启 GihHub 访问">
        <el-switch
          v-model="githubHomepage.required"
          inline-prompt
          :active-icon="Check"
          :inactive-icon="Close"
          @change="(value: boolean) => handleSwitchChange(value, 'githubHomepage')"
        ></el-switch>
      </el-form-item>

      <el-form-item
        label="GitHub 主页访问地址"
        :error="githubHomepage.errMsg"
        v-if="githubHomepage.required"
        :required="githubHomepage.required"
      >
        <el-input v-model="githubHomepage.value"></el-input>
      </el-form-item>

      <el-form-item label="开启 Gitee 访问">
        <el-switch
          v-model="giteeHomepage.required"
          inline-prompt
          :active-icon="Check"
          :inactive-icon="Close"
          @change="(value: boolean) => handleSwitchChange(value, 'giteeHomepage')"
        ></el-switch>
      </el-form-item>

      <el-form-item
        label="Gitee 主页访问地址"
        :error="giteeHomepage.errMsg"
        v-if="giteeHomepage.required"
        :required="giteeHomepage.required"
      >
        <el-input v-model="giteeHomepage.value"></el-input>
      </el-form-item>

      <el-form-item label="开启知乎访问">
        <el-switch
          v-model="zhihuHomepage.required"
          inline-prompt
          :active-icon="Check"
          :inactive-icon="Close"
          @change="(value: boolean) => handleSwitchChange(value, 'zhihuHomepage')"
        ></el-switch>
      </el-form-item>

      <el-form-item
        label="知乎主页访问地址"
        :error="zhihuHomepage.errMsg"
        v-if="zhihuHomepage.required"
        :required="zhihuHomepage.required"
      >
        <el-input v-model="zhihuHomepage.value"></el-input>
      </el-form-item>

      <el-form-item label="开启 CSDN 访问">
        <el-switch
          v-model="csdnHomepage.required"
          inline-prompt
          :active-icon="Check"
          :inactive-icon="Close"
          @change="(value: boolean) => handleSwitchChange(value, 'csdnHomepage')"
        ></el-switch>
      </el-form-item>

      <el-form-item
        label="CSDN 主页访问地址"
        :error="csdnHomepage.errMsg"
        v-if="csdnHomepage.required"
        :required="csdnHomepage.required"
      >
        <el-input v-model="csdnHomepage.value"></el-input>
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

const githubHomepage = useRule('');

const giteeHomepage = useRule('');

const zhihuHomepage = useRule('');

const csdnHomepage = useRule('');

type Key = Extract<
  keyof AdminBlogSettingType.BlogSettingDetail,
  'githubHomepage' | 'giteeHomepage' | 'zhihuHomepage' | 'csdnHomepage'
>;
const rulesMap: Record<Key, ReturnType<typeof useRule>> = {
  githubHomepage,
  giteeHomepage,
  zhihuHomepage,
  csdnHomepage,
};

function handleSwitchChange(value: boolean, type: Key) {
  rulesMap[type].value.required = value;
  rulesMap[type].value.value = '';
}

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
