import { useRule } from '@/hooks/form-hooks/basic-rules';

const useAccount = (initialValue = '', isRequired = true) => {
  const account = useRule(initialValue, isRequired);

  account.value.validate = (changeMes = true) => {
    if (account.value.value === '') {
      changeMes && (account.value.errMsg = '请输入账号');
      return false;
    }
    account.value.errMsg = '';
    return true;
  };

  return account;
};

const usePassword = (initialValue = '', isRequired = true) => {
  const password = useRule(initialValue, isRequired);

  password.value.validate = (changeMes = true) => {
    if (password.value.value === '') {
      changeMes && (password.value.errMsg = '请输入密码');
      return false;
    }
    password.value.errMsg = '';
    return true;
  };

  return password;
};

export { useAccount, usePassword };
