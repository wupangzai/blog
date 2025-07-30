import { useDialog } from '@/hooks';
import searchDialogContent from '@/components/common/page-header/content-operations/search-dialog-content.vue';
import { onMounted, onBeforeUnmount } from 'vue';

export async function useCrtlKSearch(callback: () => void) {
  async function handleKeydown(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      await callback();
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown);
  });
}

export async function useArticleSearch() {
  await useDialog({
    content: searchDialogContent,
    dialogProps: {
      width: '640',
      showClose: false,
      closeOnClickModal: false,
      footer: false,
      closeOnPressEscape: true,
    },
  });
}

export async function useCrtlKArticleSearch() {
  await useCrtlKSearch(useArticleSearch);
}
