import { ref, onMounted, onBeforeUnmount, unref } from 'vue';
import type { Ref } from 'vue';

export function useFullscreen(target?: Ref<HTMLElement | null> | HTMLElement | null) {
  const isFullscreen = ref(false);

  const getElement = () => {
    if (!target) return document.documentElement;
    return unref(target) || document.documentElement;
  };

  function enter() {
    const el = getElement();
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if ((el as any).webkitRequestFullscreen) {
      (el as any).webkitRequestFullscreen();
    } else if ((el as any).mozRequestFullScreen) {
      (el as any).mozRequestFullScreen();
    } else if ((el as any).msRequestFullscreen) {
      (el as any).msRequestFullscreen();
    }
  }

  function exit() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      (document as any).mozCancelFullScreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  }

  function toggle() {
    isFullscreen.value ? exit() : enter();
  }

  function checkFullscreen() {
    const current = getElement();
    const fsEl =
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement;

    isFullscreen.value = fsEl === current;
  }

  onMounted(() => {
    document.addEventListener('fullscreenchange', checkFullscreen);
    document.addEventListener('webkitfullscreenchange', checkFullscreen);
    document.addEventListener('mozfullscreenchange', checkFullscreen);
    document.addEventListener('MSFullscreenChange', checkFullscreen);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('fullscreenchange', checkFullscreen);
    document.removeEventListener('webkitfullscreenchange', checkFullscreen);
    document.removeEventListener('mozfullscreenchange', checkFullscreen);
    document.removeEventListener('MSFullscreenChange', checkFullscreen);
  });

  return {
    isFullscreen,
    enter,
    exit,
    toggle,
  };
}
