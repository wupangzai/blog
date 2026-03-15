import { onMounted, onUnmounted } from 'vue';

export function useCodeBg() {
  let interval: ReturnType<typeof setInterval> | null = null;
  let observer: MutationObserver | null = null;
  let resizeHandler: (() => void) | null = null;

  onMounted(() => {
    const cvs = document.getElementById('code-bg') as HTMLCanvasElement | null;
    if (!cvs || !cvs.parentElement) return;

    const parent = cvs.parentElement;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth <= 767;
    const ratio = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 2);
    const fontSize = isMobile ? 12 : 10;
    const fps = isMobile ? 16 : 30;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const colors = ['#22c55e', '#38bdf8', '#f59e0b', '#a78bfa', '#f87171'];

    let columnCount = 0;
    let nextChar: number[] = [];

    function draw() {
      const width = cvs.offsetWidth;
      const height = cvs.offsetHeight;

      ctx.fillStyle = isMobile ? 'rgba(0, 0, 0, 0.18)' : 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px Roboto Mono`;

      for (let i = 0; i < columnCount; i++) {
        const x = i * fontSize;
        const y = (nextChar[i] + 1) * fontSize;
        const char = chars.charAt(Math.floor(Math.random() * chars.length));
        const color = colors[Math.floor(Math.random() * colors.length)];

        ctx.fillStyle = color;
        ctx.fillText(char, x, y);

        if (y > height && Math.random() > 0.99) {
          nextChar[i] = 0;
        } else {
          nextChar[i]++;
        }
      }
    }

    function resizeCanvas() {
      const width = cvs.offsetWidth;
      const height = cvs.offsetHeight;

      cvs.width = width * ratio;
      cvs.height = height * ratio;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(ratio, ratio);

      columnCount = Math.floor(width / fontSize);
      nextChar = new Array(columnCount)
        .fill(0)
        .map(() => Math.floor(Math.random() * Math.max(1, Math.floor(height / fontSize))));

      draw();
    }

    resizeCanvas();
    interval = setInterval(draw, 1000 / fps);

    if (!isMobile) {
      observer = new MutationObserver(resizeCanvas);
      observer.observe(parent, { childList: true, subtree: true });
    }

    resizeHandler = resizeCanvas;
    window.addEventListener('resize', resizeHandler);
  });

  onUnmounted(() => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }

    if (observer) {
      observer.disconnect();
      observer = null;
    }

    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler);
      resizeHandler = null;
    }
  });
}
