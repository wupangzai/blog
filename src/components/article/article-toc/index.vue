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
import { getTocListFromContent } from './utils';

const tocList = ref<{ id: string; text: string; level: number }[]>([]);
const activeId = ref('');
const manualScroll = ref(false); // 是否由点击目录触发的滚动

const props = defineProps<{
  articleDetail: {
    content: string;
  };
}>();

watch(
  () => props.articleDetail.content,
  async () => {
    await nextTick(); // DOM 更新后再获取 toc
    const contentEl = document.querySelector('.article-content') as HTMLElement;
    if (contentEl) {
      tocList.value = getTocListFromContent(contentEl);
    }
  },
  { immediate: true }
);

function scrollToHeading(id: string) {
  const el = document.getElementById(id);
  if (el) {
    const offset = 80; // 顶部预留空隙
    const top = el.getBoundingClientRect().top + window.scrollY - offset;

    manualScroll.value = true;
    window.scrollTo({ top, behavior: 'smooth' });
    activeId.value = id;

    // 1 秒后允许自动高亮监听恢复
    setTimeout(() => {
      manualScroll.value = false;
    }, 1000);
  }
}

function updateActiveId() {
  if (manualScroll.value) return; // 忽略手动滚动过程中的更新
  for (const item of tocList.value) {
    const el = document.getElementById(item.id);
    if (el) {
      const top = el.getBoundingClientRect().top;
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

onMounted(() => {
  window.addEventListener('scroll', onScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});
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
  top: 4px;
  bottom: 4px;
  width: 4px;
  background-color: transparent;
  border-radius: 2px;
  transition:
    background-color 0.3s,
    height 0.3s;
}

.progress-bar.active {
  background-color: #3498db;
}
</style>
