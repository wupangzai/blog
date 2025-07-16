<template>
  <div><el-button>123</el-button></div>
</template>

<script setup lang="ts">
import { useDialog } from './hooks';

useDialog({
  content: '123',
});
</script>
