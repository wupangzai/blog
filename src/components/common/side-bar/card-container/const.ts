import githubSvg from '@/assets/svg/github.svg';
import giteeSvg from '@/assets/svg/gitee.svg';
import zhihuSvg from '@/assets/svg/zhihu.svg';
import csdnSvg from '@/assets/svg/csdn.svg';

const linksMap = [
  {
    link: '/',
    icon: githubSvg,
  },
  {
    link: '/',
    icon: giteeSvg,
  },
  {
    link: '/',
    icon: zhihuSvg,
  },
  {
    link: '/',
    icon: csdnSvg,
  },
];

const keyToLabelMap = {
  articleTotalCount: '文章',
  categoryTotalCount: '分类',
  tagTotalCount: '标签',
  pvTotalCount: '总访问量',
};

export { linksMap, keyToLabelMap };
