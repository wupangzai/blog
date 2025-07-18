<template>
  <div class="side-bar">
    <profile-card :profile="profile" :profile-statistics="profileStatistics" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import profileCard from './card-container/profile-card.vue';
import { useStates } from '@/hooks';
import API from '@/api';
import type { Profile } from '@/api/types';

const { profile } = useStates('commonModule', ['profile']);

const profileStatistics = ref<Profile.ProfileStatistics>({
  articleTotalCount: 0,
  categoryTotalCount: 0,
  pvTotalCount: 0,
  tagTotalCount: 0,
});

onMounted(async () => {
  const res = await API.profileDetail.getProfileStatistics();
  if (res) {
    profileStatistics.value = res;
  }
});
</script>

<style lang="less" scoped></style>
