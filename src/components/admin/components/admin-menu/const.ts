import {
  Monitor,
  Document,
  FolderOpened,
  Discount,
  Collection,
  ChatDotSquare,
  Bell,
  Setting,
} from '@element-plus/icons-vue';
export const iconMap = {
  Monitor,
  Document,
  FolderOpened,
  Discount,
  Collection,
  ChatDotSquare,
  Bell,
  Setting,
};

export const MenuList: MenuListItem[] = [
  { label: '仪表盘', name: 'AdminDashBoard', icon: 'Monitor' },
  { label: '文章管理', name: 'AdminArticle', icon: 'Document' },
  { label: '分类管理', name: 'AdminCategory', icon: 'FolderOpened' },
  { label: '标签管理', name: 'AdminTag', icon: 'Discount' },
  { label: '知识库管理', name: 'AdminWiki', icon: 'Collection' },
  { label: '评论管理', name: 'AdminComment', icon: 'ChatDotSquare' },
  { label: '公告管理', name: 'AdminNotice', icon: 'Bell' },
  { label: '博客设置', name: 'AdminBlog', icon: 'Setting' },
];

export interface MenuListItem {
  label: string;
  name: string;
  icon?: string;
  index?: string;
  children?: MenuListItem[];
}

// 递归添加 index
export function addIndexToMenu<T extends MenuListItem>(list: T[], parent = '') {
  return list.map((item, i) => {
    const currentIndex = parent ? `${parent}-${i + 1}` : `${i + 1}`;

    const newItem = {
      ...item,
      index: currentIndex,
    };

    if (item.children && item.children.length > 0) {
      newItem.children = addIndexToMenu(item.children, currentIndex);
    }

    return newItem;
  });
}
