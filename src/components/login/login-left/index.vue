<template>
  <div class="login-left">
    <h2 data-aos="fade-right">Weblog 博客登录</h2>
    <p data-aos="fade-right">
      一款由 DNF 只玩狂战士，云顶只玩圣源，纯运气玩家 开发的前后端分离博客。
    </p>
    <img data-aos="fade-right" :src="loginBg" alt="" />
  </div>
</template>

<script lang="ts" setup>
import loginBg from '@/assets/imgs/login-bg.png';
</script>

<style lang="less" scoped>
.login-left {
  display: flex;
  flex-direction: column;
  background-color: #0f172a;
  justify-content: center;
  color: #fff;
  align-items: center;
  padding: 40px;
  height: 100%;
  line-height: 1.6;

  h2 {
    margin: 0;
    font-weight: 700;

    font-size: 36px;
    margin-bottom: 28px;
  }

  p {
    margin: 0;
  }

  img {
    max-width: 55%;
    max-height: 55%;
  }
}
</style>
