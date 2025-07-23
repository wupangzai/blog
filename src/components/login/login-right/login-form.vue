<template>
  <el-form class="login-form">
    <el-form-item :error="account.errMsg">
      <el-input
        v-model="account.value"
        :prefix-icon="User"
        size="large"
        placeholder="请输入用户名"
      />
    </el-form-item>
    <el-form-item :error="password.errMsg">
      <el-input
        v-model="password.value"
        :prefix-icon="Lock"
        size="large"
        type="password"
        placeholder="请输入密码"
      />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { User, Lock } from '@element-plus/icons-vue';
import { useAccount, usePassword } from '@/hooks/form-hooks';

const account = useAccount('');
const password = usePassword('');

defineExpose({
  account,
  password,
});
</script>

<style lang="less" scoped>
.login-form {
  width: 40%;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
</style>
