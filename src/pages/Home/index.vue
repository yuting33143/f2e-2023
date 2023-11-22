<script setup>
import { useDynamicViewport } from '@/utils/script/useDynamicViewport.js';
import catImage from '@/assets/images/catCandidate.svg';
import dogImage from '@/assets/images/dogCandidate.svg';
import birdImage from '@/assets/images/birdCandidate.svg';

// 調用動態 vh
useDynamicViewport()

const Candidate = [
  {
    id: 1,    
    name: '喵喵 / 三花',
    img: catImage
  },
  {
    id: 2,
    name: '來福 / 旺福',
    img: dogImage
  },
  {
    id: 3,
    name: '大嘴鳥 / 波波',
    img: birdImage
  }
];

</script>

<template>
  <main class="main">
    <div class="container">

      <!-- 首頁主視覺 -->
      <div class="container__content">
        
        <div class="content__item"  v-for="(item, _) in Candidate" :key="item.id">
          <!-- 候選人圖片 -->
          <div class="imgWrapper" :class="`imgWrapper--${item.id}`">
            <img :src="item.img" alt="Candidate_img">
          </div>

          <!-- 文字內容 -->
          <span class="content__text">
            <p>{{item.name}}</p>
          </span>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>

.main{
  height: calc(var(--vh, 1vh) * 100 - 99px) !important; // TODO：這邊要再確認
  background-color: #F5F9FB;
}
.container{
  @include flex-setting;
  height: 100%;
  width: 100%;
  .container__content {
    @include flex-setting($align: flex-end);
    gap: 140px;
    .content__item{
      .imgWrapper {
        @include flex-setting;
        img {
          display: block;
        }
      }
      .imgWrapper--1{
        background-image: url('@/assets/images/catCandidateBG.svg');
        background-repeat: no-repeat;
        background-position: bottom center;
      }
      .imgWrapper--2{
        background-image: url('@/assets/images/dogCandidateBG.svg');
        background-repeat: no-repeat;
        background-position: bottom center;
      }
      .imgWrapper--3{
        background-image: url('@/assets/images/birdCandidateBG.svg');
        background-repeat: no-repeat;
        background-position: bottom center;
        width: 370px;
      }
    }
    .content__text{
      @include header2;
      @include flex-setting; 
    }
  }
}
</style>
