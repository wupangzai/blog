<template>
  <div class="toc-container">
    <h4>📋 文章目录</h4>
    <ul>
      <li
        v-for="item in tocList"
        :key="item.id"
        :style="{
          paddingLeft: `${(item.level - 1) * 16 + 8}px`,
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
const prevActiveId = ref(''); // ✅ 记录上一次的 activeId，防止重复滚动目录
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

// ✅ 让目录项在容器中“居中显示”，且只在 active 变化时触发
function scrollTocIntoCenter(behavior: ScrollBehavior = 'auto') {
  const container = document.querySelector('.toc-container') as HTMLElement | null;
  const activeLink = document.querySelector('.toc-container li a.active') as HTMLElement | null;
  if (!container || !activeLink) return;

  // 以 li 为单位更稳
  const li = activeLink.closest('li') as HTMLElement | null;
  const target = li ?? activeLink;

  const targetTop = target.offsetTop;
  const targetCenter = targetTop + target.clientHeight / 2;
  const scrollTop = Math.max(0, targetCenter - container.clientHeight / 2);

  // 只在必要时滚动，避免抖动
  const delta = Math.abs(container.scrollTop - scrollTop);
  if (delta > 8) {
    container.scrollTo({ top: scrollTop, behavior });
  }
}

// 点击目录滚到正文
function scrollToHeading(id: string) {
  const item = tocList.value.find((i) => i.id === id);
  if (!item) return;

  const el = document.querySelector(`[data-line='${item.line}']`) as HTMLElement | null;
  if (!el) return;

  const offset = 80; // 顶部留白
  const top = el.getBoundingClientRect().top + window.scrollY - offset;

  manualScroll.value = true;
  window.scrollTo({ top, behavior: 'smooth' });
  activeId.value = id;

  // 目录同步，但用 auto 可减少干扰（也可改 'smooth'）
  scrollTocIntoCenter('auto');

  setTimeout(() => (manualScroll.value = false), 300);
}

// 根据滚动更新高亮
function updateActiveId() {
  if (manualScroll.value) return;

  // 选中“已越过顶部偏移”的最后一个标题，更贴近预期
  const offset = 100;
  let candidate = '';
  for (const item of tocList.value) {
    const el = document.querySelector(`[data-line='${item.line}']`) as HTMLElement | null;
    if (!el) continue;
    const top = el.getBoundingClientRect().top;
    if (top <= offset) {
      candidate = item.id; // 持续更新到“最后一个越过阈值”的标题
    } else {
      break; // 后面的标题都更靠下了
    }
  }
  // 如果没有越过阈值，就选第一个
  if (!candidate && tocList.value.length) candidate = tocList.value[0].id;

  if (candidate && candidate !== activeId.value) {
    activeId.value = candidate;

    // ✅ 只有在 active 实际变化时才滚动目录，且用 'auto' 防止与主滚动冲突
    if (activeId.value !== prevActiveId.value) {
      scrollTocIntoCenter('auto');
      prevActiveId.value = activeId.value;
    }
  }
}

function onScroll() {
  requestAnimationFrame(updateActiveId);
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }));
onUnmounted(() => window.removeEventListener('scroll', onScroll));
</script>

<style scoped>
.toc-container {
  background: #fff;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  max-height: 85vh;
  overflow-y: auto;
}
.toc-container ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.toc-container a {
  text-decoration: none;
  color: #444;
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
