interface IsShowOptionMapItem {
  isShow: boolean;
  label: string;
}

export const isShowMapList: IsShowOptionMapItem[] = [
  {
    isShow: false,
    label: '未展示',
  },
  {
    isShow: true,
    label: '展示',
  },
];

export const isShowOptionList = isShowMapList.map((item) => {
  return {
    value: item.isShow,
    label: item.label,
  };
});

export function getIsShowMap(isShow: boolean) {
  return isShowMapList.find((item) => item.isShow === isShow)!;
}
