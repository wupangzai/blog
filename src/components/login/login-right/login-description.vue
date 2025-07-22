<template>
  <div class="login-description">
    <div class="description">
      <div class="welcome">欢迎回来</div>
      <div class="info">
        <div class="line"></div>
        <div class="sub-title">账号密码登录</div>
        <div class="line"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="less" scoped>
.login-description {
  width: 60%;
  .description {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    .welcome {
      font-weight: 700;
      font-size: 36px;
      color: #4c4e4d;
    }
    .info {
      width: 70%;
      text-align: center;
      font-size: 16px;
      color: #9fa6b2;
      display: flex;
      //   justify-content: space-between;
      align-items: center;
      padding: 0 3%;

      .sub-title {
        flex: 1;
      }

      .line {
        width: 30%;
        height: 1px;
        background-color: #e5e7eb;
      }
    }
  }
}
</style>
