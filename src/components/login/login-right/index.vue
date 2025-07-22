<template>
  <div class="login-right">
    <login-description />
    <login-form />
    <el-button size="large" class="login-btn" type="primary">登录</el-button>
  </div>
</template>

<script lang="ts" setup>
import loginForm from './login-form.vue';
import loginDescription from './login-description.vue';
</script>

<style lang="less" scoped>
.login-right {
  width: 100%;
  height: 100%;
  background-image: url('@/assets/svg/login-form-bg.svg');
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 28px;
  flex-shrink: 0;

  .login-btn {
    width: 40%;
  }
}
</style>
