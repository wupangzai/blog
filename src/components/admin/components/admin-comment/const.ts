import type { AdminCommentType } from '@/api/types';

interface StatusMapItem {
  status: AdminCommentType.Status;
  label: string;
  tagType: string;
}

export const statusMapList: StatusMapItem[] = [
  {
    status: 1,
    label: '待审核',
    tagType: 'info',
  },
  {
    status: 2,
    label: '正常',
    tagType: 'success',
  },
  {
    status: 3,
    label: '审核未通过',
    tagType: 'danger',
  },
];

export const statusOptionList = statusMapList.map((item) => {
  return {
    value: item.status,
    label: item.label,
  };
});

export function getTag(status: AdminCommentType.Status) {
  return statusMapList.find((item) => item.status === status)!;
}
