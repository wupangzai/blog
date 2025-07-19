import totalwordsSvg from '@/assets/svg/totalwords.svg';
import clockSvg from '@/assets/svg/clock.svg';
import calendarwhiteSvg from '@/assets/svg/calendarwhite.svg';
import booksSvg from '@/assets/svg/books.svg';
import fireSvg from '@/assets/svg/fire.svg';
import type { ArticleType } from '@/api/types';

interface KeyToIconMapListType {
  icon: string;
  dataKey: keyof ArticleType.ArticleDetailData;
}
export const keyToIconMapList: KeyToIconMapListType[] = [
  {
    icon: totalwordsSvg,
    dataKey: 'totalWords',
  },
  {
    icon: clockSvg,
    dataKey: 'readTime',
  },
  {
    icon: calendarwhiteSvg,
    dataKey: 'createTime',
  },
  {
    icon: booksSvg,
    dataKey: 'categoryName',
  },
  {
    icon: fireSvg,
    dataKey: 'readNum',
  },
];
