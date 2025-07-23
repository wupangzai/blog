<template>
  <div class="login-description">
    <div class="description">
      <div class="welcome">欢迎回来</div>
      <div class="info">
        <!-- <div class="line"></div> -->
        <div class="sub-title">账号密码登录</div>
        <!-- <div class="line"></div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="less" scoped>
.login-description {
  width: 100%;
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
      width: 100%;
      text-align: center;
      font-size: 16px;
      color: #9fa6b2;
      display: flex;
      //   justify-content: space-between;
      align-items: center;
      justify-content: center;

      .sub-title {
        position: relative;

        // flex: 1;

        &::before {
          position: absolute;
          left: -80%;
          top: 50%;
          //   transform: translate(50%, -50%); // 注意是正 50%
          width: 70%;
          content: '';
          height: 1px;
          background-color: #e5e7eb;
        }

        &::after {
          position: absolute;
          right: -80%;
          top: 50%;
          //   transform: translate(50%, -50%); // 注意是正 50%
          width: 70%;
          content: '';
          height: 1px;
          background-color: #e5e7eb;
        }
      }

      .line {
        flex: 1;
        height: 1px;
        background-color: #e5e7eb;
      }
    }
  }
}
</style>
