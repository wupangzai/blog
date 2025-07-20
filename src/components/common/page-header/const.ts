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
    path: '/categories',
  },
  {
    name: 'label',
    label: '标签',
    path: '/label',
  },
  {
    name: 'achieve',
    label: '归档',
    path: '/achieve',
  },
  {
    name: 'knowledge',
    label: '知识库',
    path: '/todo',
  },
];

export { defaultBtnsList };
export type { DefaultBtnsList };
