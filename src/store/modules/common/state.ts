// State 类型
interface State {
  number: number;
  name: string;
  test: string;
}

const state: State = {
  number: 1,
  name: 'dingzhen',
  test: 'test',
};

export { state };
export type { State };
