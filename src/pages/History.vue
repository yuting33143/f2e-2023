<script setup>
import { ref, computed } from 'vue';
import ScaleBar from '@/components/scaleBar.vue';
import catImage from '@/assets/images/cat-main.png';
import dogImage from '@/assets/images/dog-main.png';
import birdImage from '@/assets/images/bird-main.png';
import catBg from '@/assets/images/bg-orange.png';
import dogBg from '@/assets/images/bg-blue.png';
import birdBg from '@/assets/images/bg-green.png';
import { useWindowSizeStore } from '@/stores/windowSize.js';

const windowSizeStore = useWindowSizeStore();

const isMobile = computed(() => windowSizeStore.width <= 768);

const yearTab = [
  {
    period: '15',
    year: '2020'
  },
  {
    period: '14',
    year: '2016'
  },
  {
    period: '13',
    year: '2012'
  },
  {
    period: '12',
    year: '2008'
  }
];

const selectedYearTab = ref('2020');

const selectedPeriod = ref('15');

function changeYearTab(year) {
  selectedYearTab.value = year;
  const period = yearTab.find(item => item.year === year).period;
  selectedPeriod.value = period;
}

function changePeriod(direction) {
  let currentPeriodIndex = yearTab.findIndex(item => item.period === selectedPeriod.value);
  let newPeriodIndex = currentPeriodIndex + direction;

  if (newPeriodIndex >= 0 && newPeriodIndex < yearTab.length) {
    let newPeriod = yearTab[newPeriodIndex];
    selectedYearTab.value = newPeriod.year;
    selectedPeriod.value = newPeriod.period;
  }
}

const selectedSecondTab = ref('all');

function changeSelectedSecondTab(tab) {
  selectedSecondTab.value = tab;
}

const candidate = ref([
  {
    number: '1',
    president: '喵喵',
    vicePresident: '三花',
    party: '貓貓進步黨',
    img: catImage,
    bg: catBg,
    color: 'orange',
    vote: 8170231
  },
  {
    number: '2',
    president: '來福',
    vicePresident: '旺福',
    party: '旺星人守護黨',
    img: dogImage,
    bg: dogBg,
    color: 'blue',
    vote: 5522119
  },
  {
    number: '3',
    president: '大嘴鳥',
    vicePresident: '波波',
    party: '鳥類保育黨',
    img: birdImage,
    bg: birdBg,
    color: 'green',
    vote: 608590
  }
]);

const totalVotes = computed(() => {
  return candidate.value.reduce((sum, item) => sum + item.vote, 0);
});

const candidatePercentages = computed(() => {
  return candidate.value.map(item => ((item.vote / totalVotes.value) * 100).toFixed(2));
});

console.log(candidatePercentages.value);

const winParty = ref('1');
</script>

<template>
  <div class="history-wrapper">
    <!-- 左邊 -->
    <div class="left">
      <!-- 年份tab -->
      <div class="year-tab">
        <div
          v-for="(item, index) in yearTab"
          :key="index"
          class="tab"
          :class="{ selected: selectedYearTab == item.year }"
          @click="changeYearTab(item.year)"
        >
          <div class="period">{{ item.period }}<span>th</span></div>
          <div class="year">{{ item.year }}</div>
        </div>
      </div>
      <!-- title -->
      <div class="title">
        <div class="text">
          第<span>{{ selectedPeriod }}</span
          >任總統副總統選舉
        </div>
        <div class="arrow" v-if="!isMobile">
          <div>
            <img
              v-if="selectedPeriod != '15'"
              src="@/assets/images/button/left.png"
              @click="changePeriod(-1)"
            />
            <img v-else src="@/assets/images/button/left-disable.png" />
          </div>
          <div>
            <img
              src="@/assets/images/button/right.png"
              v-if="selectedPeriod != '12'"
              @click="changePeriod(1)"
            />
            <img v-else src="@/assets/images/button/right-disable.png" />
          </div>
        </div>
      </div>
      <!-- 總覽/各區tab -->
      <div class="all-area-tab">
        <div
          class="tab all-tab"
          :class="{ active: selectedSecondTab == 'all' }"
          @click="changeSelectedSecondTab('all')"
        >
          選舉總覽
        </div>
        <div
          class="tab area-tab"
          :class="{ active: selectedSecondTab == 'area' }"
          @click="changeSelectedSecondTab('area')"
        >
          各區票數
        </div>
        <div
          class="tab-indicator"
          :class="{
            'area-tab-select': selectedSecondTab == 'area'
          }"
        ></div>
      </div>
      <!-- 三個候選人(選舉總覽) -->
      <div class="people-group" v-if="selectedSecondTab == 'all'">
        <!-- 三個區塊-->
        <div class="people-container">
          <!-- v-for -->
          <div
            class="people-card"
            v-for="(item, index) in candidate"
            :key="index"
            :class="{ [`bg-${item.color}-light`]: isMobile }"
          >
            <div
              class="people-wrapper"
              :style="!isMobile ? { 'background-image': 'url(' + item.bg + ')' } : {}"
            >
              <div class="number" :class="`bg-${item.color}`">{{ item.number }}</div>
              <div class="text">
                <div class="group">{{ item.party }}</div>
                <div class="name">{{ item.president }} / {{ item.vicePresident }}</div>
              </div>
              <img
                class="vote"
                v-if="winParty == item.number && !isMobile"
                src="@/assets/images/elected-w.png"
              />
              <img
                class="vote"
                v-if="winParty == item.number && isMobile"
                src="@/assets/images/elected-b.png"
              />
              <img class="people" :src="item.img" />
              <div
                v-if="isMobile"
                class="people-rwd-bg"
                :style="{ 'background-image': 'url(' + item.bg + ')' }"
              ></div>
            </div>
            <div class="detail">
              <div class="party-color" :class="`bg-${item.color}`" v-if="!isMobile"></div>
              <div class="info">
                <div class="total">{{ item.vote }}票</div>
                <div class="percent">{{ candidatePercentages[index] }}%</div>
              </div>
            </div>
          </div>
        </div>
        <ScaleBar
          :aPercent="Number(candidatePercentages[0])"
          :bPercent="Number(candidatePercentages[1])"
          :cPercent="Number(candidatePercentages[2])"
          class="scale-bar"
          v-if="!isMobile"
        ></ScaleBar>
      </div>
      <!-- 左下兩個區塊(選舉總覽) -->
      <div class="vote-info" v-if="selectedSecondTab == 'all'">
        <!-- 投票率 -->
        <div class="info-area vote-percent">
          <div class="vote-text">
            <div class="vote-title">投票率</div>
            <div class="percent-info">69.4%</div>
            <div class="vote-note">
              <div class="icon">
                <img src="@/assets/images/icon/up.png" />
                <!-- <img src="@/assets/images/icon/down.png" /> -->
              </div>
              <div class="word">較前屆<span>上升</span><span class="word-number">3.02</span>%</div>
            </div>
          </div>
          <div class="circle"></div>
        </div>
        <!-- 總票數 -->
        <div class="info-area vote-total">
          <!-- 總票數 -->
          <div class="vote-text">
            <div class="total-title">總票數</div>
            <div class="total-vote">14040722票</div>
            <div class="total-note">
              <div class="icon">
                <img src="@/assets/images/icon/up.png" />
                <!-- <img src="@/assets/images/icon/down.png" /> -->
              </div>
              <div class="word">
                較前屆<span>上升</span><span class="word-number">123433</span>票
              </div>
            </div>
          </div>
          <!-- 有效/無效票 -->
          <div class="ok-no-vote">
            <!-- 有效 -->
            <div class="list-title">
              <div class="top">
                <img src="@/assets/images/icon/vote.png" />
                <div class="word">有效票</div>
              </div>
              <div class="down">13,870,377票</div>
            </div>
            <!-- 無效 -->
            <div class="list-title">
              <div class="top">
                <img src="@/assets/images/icon/invalid-vote.png" />
                <div class="word">無效票</div>
              </div>
              <div class="down">234,666票</div>
            </div>
          </div>
        </div>
      </div>
      <!--  -->
    </div>
    <!-- 右邊 -->
    <div>
      <!-- map -->
      <div></div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.history-wrapper {
  background-color: $blue-bg;
  height: 1000px;
  padding: 60px 3%;
  display: flex;

  @include rwd() {
    flex-direction: column;
  }

  @include pad {
    padding-top: 30px;
  }
  .left {
    width: 60%;

    @include rwd() {
      width: 100%;
    }
    .year-tab {
      display: flex;
      gap: 18px;

      @include pad {
        gap: 5px;
        background-color: $white;
        position: fixed;
        width: 100%;
        top: 69px;
        left: 0px;
        z-index: 50;
        height: 44px;
      }

      .tab {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 114px;
        height: 48px;
        border-radius: 16px;
        background-color: $white;
        box-shadow: 0px 0px 6px 0px rgba(206, 214, 226, 0.25);
        cursor: pointer;

        @include pad {
          gap: 3px;
          height: 42px;
          border-radius: 25px;
          width: 25%;
          border-radius: 0;
          box-shadow: none;
        }

        &:hover {
          background-color: $primary;

          .period {
            @include pad {
              background-color: $primary;
              color: $white;
            }
          }
          .year {
            @include pad {
              color: $black;
            }
          }

          @include pad {
            background-color: $white;
          }
        }
        .period {
          width: 32px;
          height: 32px;
          border: 1px solid #e9f1f5;
          border-radius: 50%;
          background-color: $blue-bg;
          font-size: 16px;
          font-weight: 800;
          color: $primary;
          display: flex;
          align-items: center;
          justify-content: center;

          @include pad {
            width: 22px;
            height: 22px;
            font-size: 11px;
          }

          span {
            font-size: 8px;
            font-weight: 600;
            padding-top: 6px;

            @include pad {
              font-size: 5px;
            }
          }
        }
        .year {
          color: $gray3;
          @include header5;

          &:hover {
            color: $white;
            @include pad {
              color: $black;
            }
          }
        }
      }
      .selected {
        background-color: $primary;

        @include pad {
          background-color: $white;
        }

        .year {
          color: $white;

          @include pad {
            color: $black;
          }
        }
        .period {
          background-color: $primary;
          color: $white;
        }

        &.tab {
          border-bottom: 2px solid $primary;
        }
      }
    }
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 40px;

      @include pad {
        margin-top: 32px;
      }

      .text {
        @include header2;
        color: $black;
      }
      .arrow {
        display: flex;
        align-items: center;
        gap: 25px;

        img {
          cursor: pointer;
        }
      }
    }
    .all-area-tab {
      margin-top: 16px;
      width: 100%;
      height: 62px;
      background-color: $white;
      padding: 8px 11px;
      box-sizing: border-box;
      border-radius: 20px;
      box-shadow: 0px 0px 6px 0px rgba(206, 214, 226, 0.25);
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;

      @include pad() {
        height: 44px;
        border-radius: 20px;
      }
      .tab {
        @include header5;
        width: 50%;
        text-decoration: none;
        color: $gray2;
        height: 46px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2;
        cursor: pointer;

        &:hover {
          color: $secondary;
        }

        @include pad() {
          height: 32px;
        }
      }
      .active {
        color: $white;
      }

      .tab-indicator {
        position: absolute;
        bottom: 8px;
        left: 10px;
        height: 46px;
        width: 50%;
        background-color: $black;
        border-radius: 16px;
        transition: all 0.25s ease-out;
        z-index: 1;
        @include pad() {
          height: 32px;
          bottom: 6px;
        }
      }
      .area-tab-select {
        left: 48%;
      }
    }
    .people-group {
      background-color: $white;
      margin-top: 32px;
      border-radius: 20px;
      box-shadow: 0px 0px 6px 0px rgba(206, 214, 226, 0.25);
      width: 100%;
      padding: 24px;
      box-sizing: border-box;

      @include pad() {
        padding: 10px;
        margin-top: 16px;
      }

      .people-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;

        @media (max-width: 1180px) {
          gap: 10px;
        }
        @include pad() {
          flex-direction: column;
        }
        .people-card {
          width: 33%;

          @include pad() {
            width: 100%;
            height: 84px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
          }
          .people-wrapper {
            height: 146px;
            border-radius: 16px 50px 16px 16px;
            background-repeat: no-repeat;
            background-size: cover;
            padding: 12px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: start;
            position: relative;
            box-sizing: border-box;

            @include pad() {
              flex-direction: row;
              height: 84px;
              align-items: center;
              position: initial;
            }

            .number {
              width: 34px;
              height: 34px;
              border: 1px solid $white;
              border-radius: 50%;
              background-color: $orange;
              font-size: 16px;
              font-weight: 800;
              color: $white;
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 2;

              @include pad() {
                @include header7;
                width: 16px;
                height: 16px;
                margin-right: 55px;
                align-self: start;
              }
            }
            .text {
              z-index: 4;
              @include pad() {
                display: flex;
                flex-direction: column-reverse;
              }
              .group {
                @include text4;
                color: $white;

                @include pad() {
                  color: $gray;
                }
              }
              .name {
                @include header4;
                color: $white;

                @media (max-width: 1100px) {
                  font-size: 18px;
                }

                @include pad() {
                  color: $black;
                }
              }
            }
            .vote {
              position: absolute;
              top: 30px;
              left: 16px;
              mix-blend-mode: soft-light;
              z-index: 1;

              @include pad() {
                left: auto;
                right: 3%;
                top: 10px;
                width: 64px;
                mix-blend-mode: color-burn;
                opacity: 50%;
              }
            }
            .people {
              position: absolute;
              bottom: 2px;
              right: 0px;
              transform: scale(1.15);
              z-index: 3;
              @media (max-width: 1080px) {
                right: -20px;
              }
              @include pad() {
                width: 55px;
                right: auto;
                bottom: auto;
                top: 16px;
                left: 18px;
                z-index: 1;
              }
            }
            .people-rwd-bg {
              width: 64px;
              height: 64px;
              background-size: cover;
              border-radius: 16px;
              position: absolute;
              left: 13px;
              top: 13px;
            }
          }
          .bg-orange {
            background-color: $orange !important;
          }
          .bg-blue {
            background-color: $blue !important;
          }
          .bg-green {
            background-color: $green !important;
          }

          .detail {
            display: flex;
            align-items: start;
            gap: 5px;
            margin-top: 29px;

            @include pad() {
              margin-top: 0;
              padding: 12px;
            }

            .party-color {
              width: 20px;
              height: 20px;
              border-radius: 6px;
              margin-top: 5px;
            }
            .info {
              text-align: right;
              z-index: 5;
              .total {
                @include header5;
                color: $black;

                @include pad() {
                  @include header4;
                }
              }
              .percent {
                @include header6;
                color: $gray;

                @include pad() {
                  color: $primary;
                }
              }
            }
          }
        }
      }
    }
    .scale-bar {
      height: 20px;
      margin-top: 16px;
    }
    .vote-info {
      display: flex;
      justify-content: space-between;
      gap: 32px;
      margin-top: 32px;
      @media (max-width: 1448px) {
        flex-direction: column;
      }
      @include pad() {
        margin-top: 16px;
        gap: 16px;
      }
      .info-area {
        background-color: $white;
        box-shadow: 0px 0px 6px 0px rgba(206, 214, 226, 0.25);
        border-radius: 20px;
        box-sizing: border-box;
        height: 178px;
        padding: 18px 24px;
        display: flex;
        align-items: end;
        justify-content: space-between;

        @include pad() {
          height: 153px;
        }

        &.vote-percent {
          width: 40%;
          @media (max-width: 1448px) {
            width: 100%;
          }
        }
        &.vote-total {
          width: 60%;
          @media (max-width: 1448px) {
            width: 100%;
          }
          @include pad {
            flex-direction: column;
            align-items: start;
            justify-content: space-between;
            height: 243px;
          }
        }
        .vote-text {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: start;
          height: 100%;

          @include pad() {
            height: auto;
          }

          .vote-title,
          .total-title {
            @include text2;
            color: gray;
          }
          .percent-info,
          .total-vote {
            @include header1;
          }
          .vote-note,
          .total-note {
            display: flex;
            align-items: center;
            .icon {
              padding-top: 2px;

              @include pad() {
                margin-right: 5px;
              }
              img {
                height: 28px;
                width: 28px;
              }
            }
            .word {
              @include text4;
              color: $gray;
              padding-bottom: 2px;

              .word-number {
                @include header6;
                padding: 0px 3px;
              }
            }
          }
        }
        .circle {
          width: 105px;
          height: 105px;
          border-radius: 50%;
          background-color: $secondary;
        }
        .ok-no-vote {
          display: flex;
          flex-direction: column;
          gap: 15px;

          @include pad() {
            flex-direction: row;
            height: 79px;
            align-items: center;
            border-radius: 12px;
            background-color: $gray5;
            width: 100%;
            justify-content: space-around;
          }

          .list-title {
            .top {
              display: flex;
              align-items: center;
              gap: 6px;
              img {
                height: 28px;
              }
              .word {
                @include text5;
                color: $gray;
              }
            }
            .down {
              @include header6;

              @include pad {
                @include header4;
              }
            }
          }
        }
      }
    }
  }
  .right {
    width: 40%;
    @include rwd() {
      width: 100%;
    }
  }
}

.bg-orange-light {
  background-color: $orange-light !important;
}
.bg-blue-light {
  background-color: $blue-light !important;
}
.bg-green-light {
  background-color: $green-light !important;
}
</style>
