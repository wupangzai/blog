<template>
  <div class="side-bar">
    <profile-card :profile="profile" :profile-statistics="profileStatistics" />
    <tags-card
      v-for="tagCard in tagsCardList"
      :key="tagCard.type"
      :type="tagCard.type"
      :label="tagCard.label"
      :icon="tagCard.icon"
      :item-list="mapTagList(tagCard.type)!"
      @arrow-click="listenArrowClick"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import profileCard from './card-container/profile-card.vue';
import tagsCard from './card-container/tags-card.vue';
import { useStates } from '@/hooks';
import API from '@/api';
import { tagsCardList } from '@/components/common/side-bar/card-container/const';
import type { CategoryListItem, TagListItem } from '@/api/tags-card/types';
import type { Profile } from '@/api/types';

const { profile } = useStates('commonModule', ['profile']);

const profileStatistics = ref<Profile.ProfileStatistics>({
  articleTotalCount: 0,
  categoryTotalCount: 0,
  pvTotalCount: 0,
  tagTotalCount: 0,
});
async function getProfileStatistics() {
  const res = await API.profileDetail.getProfileStatistics();
  if (res) {
    profileStatistics.value = res;
  }
}

const categoriesList = ref<CategoryListItem[]>();
const tagsList = ref<TagListItem[]>();

async function getTagList() {
  const listWithData = await Promise.all([
    API.tagsCard.getCategoryList(10),
    API.tagsCard.getTagList(20),
  ]);
  if (listWithData) {
    [categoriesList.value, tagsList.value] = listWithData;
  }
}

function mapTagList(type: string) {
  return type === 'categories' ? categoriesList.value : tagsList.value;
}

function listenArrowClick(type: string) {
  console.log('[ type ] >', type);
}

onMounted(() => {
  Promise.all([getProfileStatistics(), getTagList()]);
});
</script>

<style lang="less" scoped>
.side-bar {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
