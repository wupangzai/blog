interface DefaultBtnsList {
  name: string;
  label: string;
  path: string;
}

const defaultBtnsList: DefaultBtnsList[] = [
  {
    name: 'home',
    label: '首页',
    path: '',
  },
  {
    name: 'categories',
    label: '分类',
    path: '',
  },
  {
    name: 'label',
    label: '标签',
    path: '',
  },
  {
    name: 'file',
    label: '归档',
    path: '',
  },
  {
    name: 'knowledge',
    label: '知识库',
    path: '',
  },
];

export { defaultBtnsList };
export type { DefaultBtnsList };
