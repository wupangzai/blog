<template>
  <div class="profile-card">
    <div class="avatar">
      <img :src="props.profile.logo" alt="" />
    </div>
    <div class="description">
      <div class="name">{{ props.profile.author }}</div>
      <div class="introduction">{{ props.profile.introduction }}</div>
    </div>
    <div class="tags">
      <div class="tag-item" v-for="tag in tagsMapList" :key="tag.label">
        <div class="count">{{ tag.count }}</div>
        <div class="label">{{ tag.label }}</div>
      </div>
    </div>
    <div class="links">
      <img :src="item.icon" alt="" v-for="(item, key) in linksMap" :key="key" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Profile } from '@/api/types';
import { computed } from 'vue';
import { keyToLabelMap, linksMap } from '@/components/common/side-bar/card-container/const';

interface Props {
  profile: Profile.ProfileDetailData;
  profileStatistics: Profile.ProfileStatisticsData;
}
const props = defineProps<Props>();

const tagsMapList = computed(() => {
  return Object.keys(props.profileStatistics).map((key) => {
    const keyWithType = key as keyof Props['profileStatistics'];
    return {
      label: keyToLabelMap[keyWithType],
      count: props.profileStatistics[keyWithType],
    };
  });
});
</script>

<style lang="less" scoped>
.profile-card {
  width: 288px;
  padding: 20px 8px;
  background-color: #ffff;
  border-radius: 8px;
  border: 1px solid var(--el-color-info-light-7);
  display: flex;
  flex-direction: column;
  //   justify-content: center;
  align-items: center;

  .avatar {
    & img {
      border-radius: 50%;
      width: 56px;
      height: 56px;
    }
    margin-bottom: 28px;
  }
  .description {
    text-align: center;
    line-height: 28px;
    .name {
      font-weight: 500;
      font-size: 20px;
      margin-bottom: 12px;
    }
    .introduction {
      font-size: 14px;
      color: rgb(107 114 128);
      margin-bottom: 28px;
    }
  }

  .tags {
    display: flex;
    width: 80%;
    justify-content: space-between;
    margin-bottom: 28px;

    .tag-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .count {
        font-weight: 700;
        color: #4c4e4d;
        margin-bottom: 8px;
      }

      .label {
        font-size: 14px;
        color: var(--el-color-info);
      }

      &:hover {
        cursor: pointer;
        transform: scale(1.05);
        .count,
        .label {
          color: var(--el-color-primary);
        }
      }
    }
  }

  .links {
    display: flex;
    justify-content: space-between;
    width: 50%;
    & img {
      border-radius: 50%;
      width: 28px;
      height: 28px;
    }
  }
}
</style>
