export interface LoginForm {
  username: string;
  password: string;
}

export interface LoginData {
  data: {
    token: string;
  };
}
