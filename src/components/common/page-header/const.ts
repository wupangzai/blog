interface DefaultBtnsList {
  name: string;
  label: string;
  path: string;
}

const defaultBtnsList: DefaultBtnsList[] = [
  {
    name: 'home',
    label: '首页',
    path: '/',
  },
  {
    name: 'categories',
    label: '分类',
    path: '/todo',
  },
  {
    name: 'label',
    label: '标签',
    path: '/todo',
  },
  {
    name: 'file',
    label: '归档',
    path: '/todo',
  },
  {
    name: 'knowledge',
    label: '知识库',
    path: '/todo',
  },
];

export { defaultBtnsList };
export type { DefaultBtnsList };
