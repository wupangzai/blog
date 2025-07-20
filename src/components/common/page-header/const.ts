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
    name: 'wiki',
    label: '知识库',
    path: '/wiki',
  },
];

export { defaultBtnsList };
export type { DefaultBtnsList };
