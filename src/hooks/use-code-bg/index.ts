import { onMounted, onUnmounted } from 'vue';

export function useCodeBg() {
  let interval: any;
  let observer: MutationObserver | null = null;

  onMounted(() => {
    const cvs = document.getElementById('code-bg') as HTMLCanvasElement;
    if (!cvs || !cvs.parentElement) return;

    const parent = cvs.parentElement;
    const ctx = cvs.getContext('2d')!;
    const ratio = window.devicePixelRatio || 1;
    const fontSize = 10;

    let columnCount = 0;
    let nextChar: number[] = [];

    // 调整 canvas 尺寸
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
        .map(() => Math.floor(Math.random() * Math.floor(height / fontSize))); // ⚡ 随机起点

      draw(); // ⚡ resize 之后立即绘制一次，避免空白闪屏
    }

    // 绘制代码雨
    function draw() {
      const width = cvs.offsetWidth;
      const height = cvs.offsetHeight;

      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < columnCount; i++) {
        const char = getRandomChar();
        ctx.fillStyle = getRandomColor();
        ctx.font = `${fontSize}px Roboto Mono`;

        const x = i * fontSize;
        const y = (nextChar[i] + 1) * fontSize;
        ctx.fillText(char, x, y);

        if (y > height && Math.random() > 0.99) {
          nextChar[i] = 0;
        } else {
          nextChar[i]++;
        }
      }
    }

    // 初始尺寸
    resizeCanvas();

    // 定时绘制
    interval = setInterval(draw, 1000 / 30);

    // 监听父元素内容变化，自动调整 canvas
    observer = new MutationObserver(resizeCanvas);
    observer.observe(parent, { childList: true, subtree: true });

    // 可选：监听窗口大小变化
    window.addEventListener('resize', resizeCanvas);
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
    window.removeEventListener('resize', () => {});
  });
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getRandomChar() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return chars.charAt(Math.floor(Math.random() * chars.length));
}
