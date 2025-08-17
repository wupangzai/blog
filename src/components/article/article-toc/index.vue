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
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue';

const tocList = ref<{ id: string; text: string; level: number; line: number; top?: number }[]>([]);
const activeId = ref('');
const manualScroll = ref(false);

const props = defineProps<{
  catalog: { text: string; level: number; line: number }[];
}>();

// 转换 catalog 为 tocList 并生成唯一 id
watch(
  () => props.catalog,
  async () => {
    tocList.value = props.catalog.map((item, index) => ({
      id: `toc-${index}`,
      text: item.text.trim(),
      level: item.level,
      line: item.line,
    }));

    await nextTick();
    calculateTocTop();
  },
  { immediate: true, deep: true }
);

// 根据 data-line 映射真实 top
function calculateTocTop() {
  tocList.value.forEach((item) => {
    const el = document.querySelector(`[data-line='${item.line}']`) as HTMLElement;
    if (el) {
      item.top = el.offsetTop;
    }
  });
}

function scrollToHeading(id: string) {
  const item = tocList.value.find((i) => i.id === id);
  if (!item || item.top === undefined) return;

  const offset = 80;
  manualScroll.value = true;
  window.scrollTo({ top: item.top - offset, behavior: 'smooth' });
  activeId.value = id;

  setTimeout(() => (manualScroll.value = false), 1000);
}

function updateActiveId() {
  if (manualScroll.value) return;

  for (const item of tocList.value) {
    if (item.top !== undefined) {
      const top = item.top - window.scrollY;
      if (top >= 0 && top < 100) {
        activeId.value = item.id;
        break;
      }
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
