<template>
  <div class="login-right">
    <login-description />
    <login-form ref="loginFormInstance" />
    <el-button ref size="large" class="login-btn" type="primary" @click="login">登录</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import API from '@/api';
import loginForm from './login-form.vue';
import loginDescription from './login-description.vue';
import { Form } from '@/hooks/form-hooks';
import { useCookie } from '@/hooks';
import { useMutations } from '@/hooks';
import { ElNotification } from 'element-plus';
import { useRouter } from 'vue-router';

const { SET_ADMIN_TOKEN: setAdminToken } = useMutations(['SET_ADMIN_TOKEN']);
const authorization = useCookie('Authorization');
function setToken(token: string) {
  authorization.set(token);
  setAdminToken(token);
}

const router = useRouter();

const loginFormInstance = ref<InstanceType<typeof loginForm> | null>(null);
async function login() {
  if (loginFormInstance.value) {
    const { account, password } = loginFormInstance.value;
    const isValid = await Form.validateRules(account, password);
    if (isValid) {
      const res = await API.Login.login({ username: account.value, password: password.value });
      if (res) {
        const { token } = res.data;
        setToken(token);
        ElNotification({
          title: 'Success',
          message: '登录成功',
          type: 'success',
        });
        router.push('/admin');
      }
    }
  }
}
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
