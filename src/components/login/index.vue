<template>
  <div class="login">
    <div class="login-left-container">
      <login-left />
    </div>
    <div class="login-form-container">
      <login-right data-aos="fade-left" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import loginLeft from '@/components/login/login-left/index.vue';
import loginRight from '@/components/login/login-right/index.vue';
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100vh;
  display: flex;
  overflow: hidden;

  .login-left-container {
    flex: 0.58;
    height: 100%;
  }

  .login-form-container {
    flex: 0.42;
    height: 100%;
  }
}
</style>
