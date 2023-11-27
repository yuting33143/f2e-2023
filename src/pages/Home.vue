<script setup>
import { computed, ref } from 'vue';
import { useDynamicViewport } from '@/utils/script/useDynamicViewport.js';
import { useWindowSizeStore } from '@/stores/windowSize.js';
import { useRouter } from 'vue-router';
// 768px 以上 桌機板使用的圖片
import catImage from '@/assets/images/cat-main.svg';
import dogImage from '@/assets/images/dog-main.svg';
import birdImage from '@/assets/images/bird-main.svg';
import catImageBg from '@/assets/images/catCandidateBG.svg';
import dogImageBg from '@/assets/images/dogCandidateBG.svg';
import birdImageBg from '@/assets/images/birdCandidateBG.svg';

// 768px 以下 移動端使用的圖片
import catImageMobile from '@/assets/images/catCandidateMobile.svg';
import dogImageMobile from '@/assets/images/dogCandidateMobile.svg';
import birdImageMobile from '@/assets/images/birdCandidateMobile.svg';

import catImageMobileBG from '@/assets/images/catCandidateMobileBG.svg';
import dogImageMobileBG from '@/assets/images/dogCandidateMobileBG.svg';
import birdImageMobileBG from '@/assets/images/birdCandidateMobileBG.svg';

useDynamicViewport();
const windowSizeStore = useWindowSizeStore();
const isMobile = computed(() => windowSizeStore.width <= 768);
const getDynamicImage = (mobileImage, desktopImage) => {
  return isMobile.value ? mobileImage : desktopImage;
};

console.log(isMobile);

const CandidateDesk = [
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

const CandidateMobile = [
  {
    id: 1,
    name: '喵喵 / 三花',
    img: catImageMobile,
    imgBG: catImageMobileBG
  },
  {
    id: 2,
    name: '來福 / 旺福',
    img: dogImageMobile,
    imgBG: dogImageMobileBG
  },
  {
    id: 3,
    name: '大嘴鳥 / 波波',
    img: birdImageMobile,
    imgBG: birdImageMobileBG
  }
];
const router = useRouter();

function currentToRoute() {
  router.push('/current');
}
function historyToRoute() {
  router.push('/history');
}
</script>

<template>
  <main class="main">
    <div class="container" :class="{ 'container--mobile': isMobile }">
      <!-- 首頁主視覺 1 -->
      <div class="container__content">
        <div
          class="content__item"
          v-if="!isMobile"
          v-for="(item, _) in CandidateDesk"
          :key="item.id"
        >
          <!-- 候選人圖片 -->
          <div class="imgWrapper" :class="`imgWrapper--${item.id}`">
            <img class="candidate-img" :src="item.img" alt="Candidate_img" />
          </div>

          <!-- 文字內容 -->
          <span class="content__text">
            <p>{{ item.name }}</p>
          </span>
        </div>

        <div
          class="content__item"
          v-if="isMobile"
          v-for="(item, _) in CandidateMobile"
          :key="item.id"
        >
          <!-- 候選人圖片 -->
          <div class="img-and-text">
            <div class="imgWrapper" :class="`imgWrapper--${item.id}`">
              <img class="imgWrapper__img" :src="item.img" alt="Candidate_img" />
              <!-- <img class="imgWrapper__imgBG" :src="item.imgBG" alt="Candidate_imgBG" /> -->
            </div>

            <!-- 文字內容 -->
            <span class="content__text" v-if="isMobile">
              <p>{{ item.name }}</p>
            </span>
          </div>

          <!-- bg -->
          <div class="mobile-bg">
            <!-- <img :src="item.imgBG" alt="" /> -->
          </div>
        </div>
      </div>

      <!-- footer -->
      <div class="footer">
        <!-- section1 -->
        <section class="footer-section_1">
          <span>
            2024 Taiwan
            <br v-if="!isMobile" />
            Presidential
            <br v-if="!isMobile" />
            Election
          </span>
        </section>

        <!-- section2 -->
        <section class="footer-section_2" @click="currentToRoute">
          <span>{{ $t('header.current') }}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="33"
            height="32"
            viewBox="0 0 33 32"
            fill="none"
          >
            <g clip-path="url(#clip0_200_5743)">
              <path
                d="M21.8333 6.66663C21.8333 7.65596 22.8107 9.13329 23.8 10.3733C25.072 11.9733 26.592 13.3693 28.3347 14.4346C29.6413 15.2333 31.2253 16 32.5 16M32.5 16C31.2253 16 29.64 16.7666 28.3347 17.5653C26.592 18.632 25.072 20.028 23.8 21.6253C22.8107 22.8666 21.8333 24.3466 21.8333 25.3333M32.5 16L0.499999 16"
                stroke="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_200_5743">
                <rect width="32" height="32" fill="white" transform="translate(32.5) rotate(90)" />
              </clipPath>
            </defs>
          </svg>
        </section>

        <!-- section3 -->
        <section class="footer-section_3" v-if="!isMobile" @click="historyToRoute">
          <span>{{ $t('header.history') }}</span>
        </section>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
// 首頁主視覺容器
.main {
  // background-color: $blue-bg;
  // height: calc(100vh - 99px);

  @include pad() {
    height: calc(100vh - 69px);
  }

  // 內容容器
  .container {
    @include flex-setting($direction: column);
    background-color: $blue-bg;
    // height: 100%;
    width: 100%;

    @include pad {
      height: 100%;
    }

    .container__content {
      @include flex-setting;
      justify-content: space-between;
      width: 100%;
      gap: 100px;
      background-color: $blue-bg;
      padding: 0 3%;
      box-sizing: border-box;
      height: calc(100vh - 249px);

      @include pad {
        height: calc(100vh - 212px);
        overflow: hidden;
        gap: 20px;
        justify-content: space-between !important;
        padding: 10px 0;
      }

      .content__item {
        @include flex-setting($direction: column);
        width: 30%;
        height: 500px;
        gap: 22px;
        @include pad {
          width: 100%;
          height: 29%;
          flex-direction: row-reverse;
          position: relative;
          justify-content: start;
        }

        &:nth-child(1) {
          .imgWrapper {
            .imgWrapper__img {
              position: absolute;
              left: 115px !important;
              bottom: 0;
              @include pad {
                right: 28%;
                left: auto !important;
              }
            }
            // @include pad {
            //   background-image: url(@/assets/images/catCandidateMobileBG.svg);
            //   border-radius: 0 80px 80px 0;
            // }
          }
          .mobile-bg {
            background-image: url(@/assets/images/catCandidateMobileBG.svg);
            background-size: cover;
          }
        }
        &:nth-child(2) {
          .imgWrapper {
            .imgWrapper__img {
              position: absolute;
              // left: 435px !important;
              bottom: 0;
              @include pad {
                left: 28%;
              }
            }
            // @include pad {
            //   background-image: url(@/assets/images/dogCandidateMobileBG.svg);
            // }
          }
          .mobile-bg {
            background-image: url(@/assets/images/dogCandidateMobileBG.svg);
            background-size: cover;
          }
          @include pad {
            justify-content: end;
            flex-direction: row;
          }
          .mobile-bg {
            border-radius: 100px 0 0 100px;
          }

          .content__text {
            @include pad {
              left: auto;
              right: 3%;
            }
          }
        }
        &:nth-child(3) {
          .imgWrapper {
            .imgWrapper__img {
              position: absolute;
              left: 115px !important;
              bottom: 0;
              @include pad {
                right: 28%;
                left: auto !important;
              }
            }
            // @include pad {
            //   background-image: url(@/assets/images/birdCandidateMobileBG.svg);
            // }
          }
          .mobile-bg {
            background-image: url(@/assets/images/birdCandidateMobileBG.svg);
            background-size: cover;
          }
        }

        // 候選人背景公用設定
        .imgWrapper {
          @include flex-setting;
          width: 100%;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: bottom center;
          transition: 0.5s;
          position: relative;
          cursor: pointer;

          @include pad() {
            height: 100%;
          }

          &:hover {
            transform: translateY(-10px);
            cursor: auto;
          }

          img {
            display: block;
            max-height: 100%;
            max-width: 100%;

            @include pad() {
              width: fit-content;
            }
          }
        }

        .imgWrapper--1,
        .imgWrapper--3 {
          @include pad() {
            background-size: contain;
            background-position: bottom left;
            justify-content: flex-start;
          }
        }
        // 候選人文字內容
        .content__text {
          @include header2;
          @include flex-setting;
          height: 42px;

          @include pad {
            color: $white;
            @include header6;
          }
        }
      }
    }
    .mobile-bg {
      height: 100%;
      width: 80%;
      overflow: hidden;
      border-radius: 0 100px 100px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        // height: 100%;
        width: 100%;
      }

      // .mobile-bg {
      // border-radius: 100px 0 0 100px;
      // }
    }
    .img-and-text {
      position: absolute;
      width: 100%;
      height: 100%;
      .imgWrapper {
        img {
          margin-bottom: 5px;
          transform: scale(1.3);
          bottom: 17px !important;
          @include mobile {
            bottom: 13px !important;
          }
        }
      }
      .content__text {
        position: absolute;
        bottom: 0px;
        left: 3%;
      }
    }

    // 即時開票地圖/歷史開票結果 footer
    .footer {
      width: 100%;
      display: grid;
      align-items: center;
      grid-template-columns: 4fr 3fr 2fr;
      padding: 0 3%;
      box-sizing: border-box;
      background-color: $white;
      height: 150px;
      gap: 3%;

      @include pad() {
        height: 130px;
        grid-template-columns: 1fr;
        gap: 0;
        padding: 0;
      }

      section {
        @include flex-setting;
        text-align: center;
        height: 100%;
      }

      .footer-section_1 {
        @include header5;
        background-color: $white;
        text-align: left;
        display: flex;
        justify-content: start;
        @include pad() {
          height: 49px;
          text-align: center;
          justify-content: center;
          background-color: $blue-bg;
        }
      }
      .footer-section_2 {
        @include text1;
        color: $white;
        background-color: #2b2b2d;
        cursor: pointer;

        @include pad() {
          height: 87px;
        }

        &:hover {
          background-color: $primary;
        }

        svg {
          animation: fadeInMoveRight 1.2s infinite;
          margin-left: 10px;
          fill: $white;
        }
      }
      .footer-section_3 {
        @include text1;
        background-color: $white;
        cursor: pointer;
        &:hover {
          color: $primary;
        }
      }
    }
  }

  .container--mobile {
    .container__content {
      @include flex-setting($direction: column);
      @include pad() {
        padding-inline: 0;
      }
    }
  }
}

@keyframes fadeInMoveRight {
  from {
    opacity: 0;
    transform: translateX(-5px); /* 根据需要调整这个值 */
  }
  to {
    opacity: 1;
    transform: translateX(10);
  }
}
</style>
