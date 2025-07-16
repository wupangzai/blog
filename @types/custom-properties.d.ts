// global.d.ts
import { ComponentCustomProperties } from 'vue';
import { http } from '@/packages/axios/common';

declare module '@vue/runtime-core' {
  // 为 Vue 实例的类型扩展
  interface ComponentCustomProperties {
    $http: typeof http; // 全局变量
  }
}
