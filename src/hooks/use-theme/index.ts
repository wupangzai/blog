import { useRoute } from 'vue-router';
import { watch } from 'vue';
import { useMutations } from '@/hooks';

export function useTheme() {
  const route = useRoute();

  const { SET_THEME } = useMutations(['SET_THEME']);
  watch(
    () => route.path,
    () => {
      const isAdminPage = route.path.includes('admin');
      if (isAdminPage) {
        SET_THEME({ theme: 'admin', ignoreLocal: true });
        return;
      }
      SET_THEME({ theme: 'light', ignoreLocal: false });
    },
    { immediate: true }
  );
}
