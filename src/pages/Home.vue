<script setup>
import { computed, ref } from 'vue';
// import { useDynamicViewport } from '@/utils/script/useDynamicViewport.js';
import { useWindowSizeStore } from '@/stores/windowSize.js';
import { useI18n } from 'vue-i18n';
import catImage from '@/assets/images/catCandidate.svg';
import dogImage from '@/assets/images/dogCandidate.svg';
import birdImage from '@/assets/images/birdCandidate.svg';
import catImage from '@/assets/images/catCandidate.svg';
import dogImage from '@/assets/images/dogCandidate.svg';
import birdImage from '@/assets/images/birdCandidate.svg';

const windowSizeStore = useWindowSizeStore();
const isMobile = computed(() => windowSizeStore.width <= 768);

// 調用動態 vh
// useDynamicViewport()
switch (isMobile) {
  case value:
    
    break;

  default:
    break;
}
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
    <div class="container" >
      <!-- 首頁主視覺 1 -->
      <div class="container__content" v-if="!isMobile">
        
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

      <!-- 首頁主視覺 2 ( viewport < 768px) -->
      <div class="container__content" v-if="isMobile">
        
        <div class="content__item" v-for="(item, _) in Candidate" :key="item.id">
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

    <!-- footer -->
    <footer>
      <!-- section1 -->
      <section class="footer-section_1" v-if="!isMobile">
        <span>
          2024 Taiwan
          <br>
          Presidential 
          <br>
          Election
        </span>
      </section>
      
      <!-- section2 -->
      <section class="footer-section_2">
        <span>即時開票地圖</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="33" height="32" viewBox="0 0 33 32" fill="none">
          <g clip-path="url(#clip0_200_5743)">
          <path d="M21.8333 6.66663C21.8333 7.65596 22.8107 9.13329 23.8 10.3733C25.072 11.9733 26.592 13.3693 28.3347 14.4346C29.6413 15.2333 31.2253 16 32.5 16M32.5 16C31.2253 16 29.64 16.7666 28.3347 17.5653C26.592 18.632 25.072 20.028 23.8 21.6253C22.8107 22.8666 21.8333 24.3466 21.8333 25.3333M32.5 16L0.499999 16" stroke="white"/>
          </g>
          <defs>
          <clipPath id="clip0_200_5743">
          <rect width="32" height="32" fill="white" transform="translate(32.5) rotate(90)"/>
          </clipPath>
          </defs>
        </svg> 
      </section>
      
      <!-- section3 -->
      <section class="footer-section_3" v-if="!isMobile">
        <span>歷史開票結果</span>
      </section>

    </footer>
  </main>
</template>

<style lang="scss" scoped>

.main{
  background-color: $blue-bg;
  height: calc(var(--vh, 1vh) * 100) !important; // TODO：這邊要再確認
  .container{
    @include flex-setting;
    height: 100%;
    width: 100%;
    .container__content {
      @include flex-setting($align: flex-end);
      
      background-color: $blue-bg;
      flex-wrap: wrap;
      gap: 140px;
      // padding-top: 99px;
      .content__item{
        .imgWrapper {
          @include flex-setting;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: bottom center;
          cursor: pointer;
          transition: .5s;

          &:hover {
            transform: translateY(-10px);
            box-shadow: 1px 1px 10px 0px rgba(0,0,0,0.75);
          }
          
          img {
            display: block;
          }
        }
        .imgWrapper--1{
          background-image: url('@/assets/images/catCandidateBG.svg');
          
        }
        .imgWrapper--2{
          background-image: url('@/assets/images/dogCandidateBG.svg');
        }
        .imgWrapper--3{
          background-image: url('@/assets/images/birdCandidateBG.svg');
          width: 370px;
        }
      }
      .content__text{
        @include header2;
        @include flex-setting; 
      }
    }
  }

  footer {
    display: grid;
    align-items: center;
    grid-template-columns: 3fr 2fr 1fr;
    
    @include pad(){
      height: 87px;
      grid-template-columns: 1fr;
    }
    
    section {
      @include flex-setting;
      text-align: center;
      height: 100%;
    }

    .footer-section_1 {
      @include header5;
      background-color: $white;
    }
    .footer-section_2 {
      @include text1;
      color: $white;
      background-color: #2B2B2D;

      svg {
        margin-left: 10px;
        fill: $white;
      }
    }
    .footer-section_3 {
      @include text1;
      background-color: $white;
    }
  }
}



</style>
