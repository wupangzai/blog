import { http } from '@/packages/axios/common';
import type { LoginType } from '@/api/types';

export async function login(loginForm: LoginType.LoginForm) {
  try {
    const res = await http.postJson<LoginType.LoginData>('/api/login', loginForm);
    return res;
  } catch (e) {
    console.log(e);
  }
}
