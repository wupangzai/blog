<template>
  <div class="content-btns" ref="containerRef">
    <div
      v-for="(btn, index) in props.btnNames"
      :key="btn.name"
      :ref="(el) => (btnRefs[index] = el as HTMLElement)"
      class="btn"
      :class="[{ 'is-active': isActiveNameEqualName(btn.name) }]"
      @click="handleClick(btn.name, index, btn.path)"
    >
      {{ btn.label }}
    </div>

    <!-- 滑块 underline -->
    <div class="slider" :style="sliderStyle"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, watch } from 'vue';
import { defaultBtnsList } from '@/components/common/page-header/const';
import type { DefaultBtnsList } from '@/components/common/page-header/const';
import { useRoute } from 'vue-router';

interface Props {
  btnNames?: DefaultBtnsList[];
}

const props = withDefaults(defineProps<Props>(), {
  btnNames: () => defaultBtnsList,
});

const emits = defineEmits<{
  (e: 'changeActiveBtn', name: string): void;
}>();
function handleClick(name: string, index: number, path: string) {
  currentActiveName.value = name;
  currentIndex.value = index;
  emits('changeActiveBtn', path);
}

let defaultActiveName = props.btnNames[0].name;
const currentIndex = ref(0);
let currentActiveName = ref(defaultActiveName);

function isActiveNameEqualName(name: string) {
  return name === currentActiveName.value;
}

const containerRef = ref<HTMLElement | null>(null);
const btnRefs: HTMLElement[] = [];

const sliderStyle = ref({
  width: '0px',
  left: '0px',
  opacity: '0',
});

// 更新滑块的宽度与位置
function updateSlider() {
  const el = btnRefs[currentIndex.value];
  if (el && el instanceof HTMLElement) {
    sliderStyle.value = {
      width: `${el.offsetWidth}px`,
      left: `${el.offsetLeft}px`,
      opacity: '1',
    };
  }
}

watch(currentIndex, () => nextTick(updateSlider), { immediate: true });

const route = useRoute();
watch(
  () => route.path,
  () => {
    defaultBtnsList.forEach((btn, index) => {
      if (btn.path === route.path) {
        currentIndex.value = index;
        currentActiveName.value = btn.name;
      }
    });
  },
  {
    immediate: true,
  }
);
</script>

<style lang="less" scoped>
.content-btns {
  width: 304px;
  display: flex;
  position: relative;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.6;
  justify-content: space-between;

  .btn {
    cursor: pointer;
    padding: 4px 6px;
    color: var(---custom-header-color);

    &.is-active {
      color: var(--el-color-primary);
    }
  }

  .slider {
    position: absolute;
    bottom: 0;
    height: 2px;
    background-color: var(--el-color-primary);
    transition: all 0.3s ease;
    z-index: 1;
  }
}
</style>
