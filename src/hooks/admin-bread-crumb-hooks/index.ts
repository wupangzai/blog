import { ref, watch } from 'vue';
import { useCookie } from '../cookies-hooks';
import { MenuList } from '@/components/admin/components/admin-menu/const';
interface AdminBreadCrumbItem {
  label: string;
  name: string;
}

const defaultRouteName = 'AdminDashBoard';
const defaultCrumb = MenuList.find((item) => item.name === defaultRouteName)!;

let initialized = false;

const adminBreadCrumb = ref<AdminBreadCrumbItem[]>([]);

function useAdminBreadCrumb() {
  const adminBreadCrumbCookie = useCookie<AdminBreadCrumbItem[]>('admin-bread-crumb');

  if (!initialized) {
    adminBreadCrumb.value = adminBreadCrumbCookie.get() || [{ ...defaultCrumb }];
    initialized = true;
  }

  watch(
    adminBreadCrumb,
    (val) => {
      adminBreadCrumbCookie.set(val);
    },
    { deep: true }
  );

  return adminBreadCrumb;
}

export { useAdminBreadCrumb };
