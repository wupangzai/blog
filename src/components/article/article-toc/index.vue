<template>
  <div class="toc-container">
    <h4>📋 文章目录</h4>
    <ul>
      <li
        v-for="item in tocList"
        :key="item.id"
        :style="{
          paddingLeft: `${item.level * 16}px`,
          margin: '6px',
          position: 'relative',
        }"
      >
        <span
          class="progress-bar"
          :class="{ active: activeId === item.id }"
          :style="{ left: `${5}px` }"
        ></span>

        <a
          href="javascript:void(0)"
          :class="{ active: activeId === item.id }"
          @click.prevent="scrollToHeading(item.id)"
        >
          {{ item.text }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';

const tocList = ref<{ id: string; text: string; level: number; line: number }[]>([]);
const activeId = ref('');
const manualScroll = ref(false);

const props = defineProps<{
  catalog: { text: string; level: number; line: number }[];
}>();

watch(
  () => props.catalog,
  () => {
    tocList.value = props.catalog.map((item, index) => ({
      id: `toc-${index}`,
      text: item.text.trim(),
      level: item.level,
      line: item.line,
    }));
  },
  { immediate: true, deep: true }
);

function scrollToHeading(id: string) {
  const item = tocList.value.find((i) => i.id === id);
  if (!item) return;

  const el = document.querySelector(`[data-line='${item.line}']`) as HTMLElement | null;
  if (!el) return;

  const offset = 80;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;

  manualScroll.value = true; // 开始手动滚动，屏蔽滚动高亮
  activeId.value = id; // 高亮立即更新
  window.scrollTo({ top, behavior: 'smooth' });

  // 500ms 后恢复文章滚动监听（可根据滚动距离调整）
  setTimeout(() => {
    manualScroll.value = false;
  }, 1500);
}

function updateActiveId() {
  if (manualScroll.value) return; // 屏蔽滚动时更新高亮

  const offset = 100;
  let candidate = '';
  for (const item of tocList.value) {
    const el = document.querySelector(`[data-line='${item.line}']`) as HTMLElement | null;
    if (!el) continue;
    if (el.getBoundingClientRect().top <= offset) candidate = item.id;
    else break;
  }

  if (!candidate && tocList.value.length) candidate = tocList.value[0].id;

  if (candidate && candidate !== activeId.value) {
    activeId.value = candidate;
    scrollTocIntoCenter(); // 仅外层滚动时目录居中
  }
}

// toc 居中滚动
function scrollTocIntoCenter(behavior: ScrollBehavior = 'auto') {
  const container = document.querySelector('.toc-container') as HTMLElement | null;
  const activeLink = document.querySelector('.toc-container li a.active') as HTMLElement | null;
  if (!container || !activeLink) return;

  const li = activeLink.closest('li') as HTMLElement | null;
  const target = li ?? activeLink;

  const targetTop = target.offsetTop;
  const targetCenter = targetTop + target.clientHeight / 2;
  const scrollTop = Math.max(0, targetCenter - container.clientHeight / 2);

  const delta = Math.abs(container.scrollTop - scrollTop);
  if (delta > 8) {
    container.scrollTo({ top: scrollTop, behavior });
  }
}

function onScroll() {
  requestAnimationFrame(updateActiveId);
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }));
onUnmounted(() => window.removeEventListener('scroll', onScroll));
</script>

<style scoped lang="less">
.toc-container {
  background: var(--custom-notice-bg-color);
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  max-height: 85vh;
  overflow-y: auto;
  /* 滚动条微调 */
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: rgba(52, 152, 219, 0.4) transparent; /* Firefox */
}
/* Webkit 浏览器滚动条 */
.toc-container::-webkit-scrollbar {
  width: 6px;
}

.toc-container::-webkit-scrollbar-track {
  background: transparent;
}

.toc-container::-webkit-scrollbar-thumb {
  background-color: rgba(52, 152, 219, 0.4);
  border-radius: 3px;
}

.toc-container::-webkit-scrollbar-thumb:hover {
  background-color: rgba(52, 152, 219, 0.6);
}
.toc-container ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.toc-container a {
  text-decoration: none;
  color: var(--custom-toc-a-color);
  display: block;
  padding: 4px 0;
  transition: all 0.2s;
  cursor: pointer;
}
.toc-container a.active {
  color: #3498db;
  font-weight: bold;
}

.progress-bar {
  position: absolute;
  top: -3px;
  bottom: -3px;
  width: 1px;
  background-color: var(--el-color-info-light-5);
  border-radius: 2px;
  transition:
    background-color 0.3s,
    height 0.3s;
}
.progress-bar.active {
  top: 4px;
  bottom: 4px;
  left: 4px !important;
  width: 4px;
  background-color: #3498db;
}
</style>
