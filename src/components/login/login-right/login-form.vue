<template>
  <el-form class="login-form">
    <el-input :prefix-icon="User" size="large" placeholder="请输入用户名" />
    <el-input :prefix-icon="Lock" size="large" type="password" placeholder="请输入密码" />
  </el-form>
</template>

<script lang="ts" setup>
import { User, Lock } from '@element-plus/icons-vue';
</script>

<style lang="less" scoped>
.login-form {
  width: 40%;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
</style>
