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
        <!-- 左边进度条 -->
        <span
          class="progress-bar"
          :class="{ active: activeId === item.id }"
          :style="{ left: `${5}px` }"
        ></span>

        <!-- 目录链接 -->
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

// 转换 catalog 为 tocList 并生成唯一 id
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

// 点击 TOC 滚动到标题顶部（带偏移）
function scrollToHeading(id: string) {
  const item = tocList.value.find((i) => i.id === id);
  if (!item) return;

  const el = document.querySelector(`[data-line='${item.line}']`) as HTMLElement;
  if (!el) return;

  const offset = 80; // 顶部留白
  const top = el.getBoundingClientRect().top + window.scrollY - offset;

  manualScroll.value = true;
  window.scrollTo({ top, behavior: 'smooth' });
  activeId.value = id;

  // 1 秒后允许自动高亮更新
  setTimeout(() => (manualScroll.value = false), 1000);
}

// 自动高亮当前可视区标题
function updateActiveId() {
  if (manualScroll.value) return;

  for (const item of tocList.value) {
    const el = document.querySelector(`[data-line='${item.line}']`) as HTMLElement;
    if (!el) continue;

    const top = el.getBoundingClientRect().top;
    if (top >= 0 && top < 100) {
      activeId.value = item.id;
      break;
    }
  }
}

function onScroll() {
  requestAnimationFrame(updateActiveId);
}

onMounted(() => window.addEventListener('scroll', onScroll));
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
