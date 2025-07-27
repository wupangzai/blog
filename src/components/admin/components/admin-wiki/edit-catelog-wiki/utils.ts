import type { AdminWikiType } from '@/api/types';

export function removeItemByIdFromChildren(
  list: AdminWikiType.AdminWikiCatelogItem[],
  idToRemove: number
): AdminWikiType.AdminWikiCatelogItem[] {
  return list
    .map((item) => {
      // 判断对象的任意属性值是否等于 idToRemove
      const hasId = Object.values(item).some((value) => value === idToRemove);
      if (hasId) {
        // 如果有，删除这个对象
        return null;
      }

      // 递归处理 children
      const newChildren = item.children?.length
        ? removeItemByIdFromChildren(item.children, idToRemove)
        : [];

      return {
        ...item,
        children: newChildren,
      };
    })
    .filter(Boolean) as AdminWikiType.AdminWikiCatelogItem[];
}

export function moveItemByIdFromChildren(
  list: AdminWikiType.AdminWikiCatelogItem[],
  idToMove: number,
  moveType: 'up' | 'down'
): AdminWikiType.AdminWikiCatelogItem[] {
  const moveInArray = (
    arr: AdminWikiType.AdminWikiCatelogItem[],
    index: number,
    direction: 'up' | 'down'
  ) => {
    const newArr = [...arr];
    if (direction === 'up' && index > 0) {
      [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
    }
    if (direction === 'down' && index < arr.length - 1) {
      [newArr[index], newArr[index + 1]] = [newArr[index + 1], newArr[index]];
    }

    // 重新设置 sort 属性
    return newArr.map((item, i) => ({ ...item, sort: i + 1 }));
  };

  const recursive = (
    items: AdminWikiType.AdminWikiCatelogItem[]
  ): AdminWikiType.AdminWikiCatelogItem[] => {
    const index = items.findIndex((item) => item.id === idToMove);
    if (index !== -1) {
      // 当前数组中找到了目标，进行移动
      return moveInArray(items, index, moveType);
    }

    // 没找到，递归 children
    return items.map((item) => {
      const newChildren = item.children?.length ? recursive(item.children) : item.children;

      return {
        ...item,
        children: newChildren,
      };
    });
  };

  return recursive(list);
}

export function addItemsToChildrenById(
  list: AdminWikiType.AdminWikiCatelogItem[],
  idToFind: number,
  newItems: AdminWikiType.AdminWikiCatelogItem[]
): AdminWikiType.AdminWikiCatelogItem[] {
  const recursive = (
    items: AdminWikiType.AdminWikiCatelogItem[]
  ): AdminWikiType.AdminWikiCatelogItem[] => {
    return items.map((item) => {
      if (item.id === idToFind) {
        const oldChildren = item.children ?? [];

        // 合并旧children和新items
        const combinedChildren = [...oldChildren, ...newItems];

        // 重新给所有children的sort排序，从1开始递增
        const sortedChildren = combinedChildren.map((child, idx) => ({
          ...child,
          sort: idx + 1,
        }));

        return {
          ...item,
          children: sortedChildren,
        };
      }

      return {
        ...item,
        children: item.children?.length ? recursive(item.children) : item.children,
      };
    });
  };

  return recursive(list);
}
