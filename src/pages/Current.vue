<script setup>
import { ref, computed, onMounted } from 'vue';
import ScaleBar from '@/components/scaleBar.vue';
import catImage from '@/assets/images/cat-main.png';
import dogImage from '@/assets/images/dog-main.png';
import birdImage from '@/assets/images/bird-main.png';
import catBg from '@/assets/images/bg-orange.png';
import dogBg from '@/assets/images/bg-blue.png';
import birdBg from '@/assets/images/bg-green.png';
import mingcute_search from '@/assets/images/mingcute_search.svg';
import { useWindowSizeStore } from '@/stores/windowSize.js';
import SearchDialog from '@/components/SearchDialog.vue';
import TaiwanMap from '../components/TaiwanMap.vue';

const windowSizeStore = useWindowSizeStore();
const isMobile = computed(() => windowSizeStore.width <= 768);

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


const winParty = ref('1');

// search 跳窗
const showDrawer = ref(false);

// 綁定選擇框的選項
const centerDialogVisible = ref(false);
const selectedCityCode = ref(null);
const selectedTownCode = ref(null);
const selectedVillage = ref(null);
const cityOptions = ref([]);
const filteredVillages = ref([]);
const filteredTowns = ref([]);
const townsOptions = ref([]);
const villageOptions = ref([]);

// 存儲搜索結果的響應式陣列
const searchResults = ref([]); 


const testCountry = [
  {
    city: '台北市',
    party1: '42',
    party2: '54',
    party3: '14'
  },
  {
    city: '新北市',
    party1: '37',
    party2: '42',
    party3: '21'
  },
  {
    city: '台北市',
    party1: '42',
    party2: '54',
    party3: '14'
  },
  {
    city: '新北市',
    party1: '37',
    party2: '42',
    party3: '21'
  },
  {
    city: '台北市',
    party1: '42',
    party2: '54',
    party3: '14'
  },
  {
    city: '新北市',
    party1: '37',
    party2: '42',
    party3: '21'
  },
  {
    city: '台北市',
    party1: '42',
    party2: '54',
    party3: '14'
  },
  {
    city: '新北市',
    party1: '37',
    party2: '42',
    party3: '21'
  },
  {
    city: '台北市',
    party1: '42',
    party2: '54',
    party3: '14'
  },
  {
    city: '新北市',
    party1: '37',
    party2: '42',
    party3: '21'
  },
  {
    city: '台北市',
    party1: '42',
    party2: '54',
    party3: '14'
  },
  {
    city: '新北市',
    party1: '37',
    party2: '42',
    party3: '21'
  },
  {
    city: '台北市',
    party1: '42',
    party2: '54',
    party3: '14'
  },
  {
    city: '新北市',
    party1: '37',
    party2: '42',
    party3: '21'
  },
  {
    city: '台北市',
    party1: '42',
    party2: '54',
    party3: '14'
  },
  {
    city: '新北市',
    party1: '37',
    party2: '42',
    party3: '21'
  },
  {
    city: '台北市',
    party1: '42',
    party2: '54',
    party3: '14'
  },
  {
    city: '新北市',
    party1: '37',
    party2: '42',
    party3: '21'
  },
  {
    city: '台北市',
    party1: '42',
    party2: '54',
    party3: '14'
  },
  {
    city: '新北市',
    party1: '37',
    party2: '42',
    party3: '21'
  }
];


// 取得 市/縣 選項
const COUNTY_FETCH = async () => {
  try {
    const response = await fetch('/map/COUNTY_MOI_1090820.json');
    const jsonData = await response.json();
    
    cityOptions.value = jsonData.features.map(element => {
      return {
        ID: element.properties.COUNTYID,
        CODE: element.properties.COUNTYCODE,
        NAME: element.properties.COUNTYNAME,
      };
    });
    console.log(cityOptions.value);
  } catch (error) {
    console.error('失敗:', error);
  }
};

// 取得 鄉鎮市區 選項
const TOWN_FETCH = async () => {
  try {
    const response = await fetch('/map/TOWN_MOI_1120825.json');
    const jsonData = await response.json();
    
    townsOptions.value = jsonData.features.map(element => {
      return {
        ID: element.properties.TOWNID,
        CODE: element.properties.TOWNCODE,
        NAME: element.properties.TOWNNAME,
      }
    });
    console.log(townsOptions.value);
  } catch (error) {
    console.error('失敗:', error);
  }
};

// 取得 村里 選項
const VILLAGE_FETCH = async () => {
  try {
    const response = await fetch('/map/VILLAGE_NLSC_121_1120928.json');
    const jsonData = await response.json();
    villageOptions.value = jsonData.features.map(element => {
      return {
        ID: element.properties.VILLAGECODE,
        CODE: element.properties.VILLAGECODE,
        NAME: element.properties.VILLAGENAME,
      }
    });
    console.log(villageOptions.value);
  } catch (error) {
    console.error('失敗:', error);
  }
};

// 選擇縣市時，過濾出該縣市的鄉鎮市區
const onCityChange = (cityCode) => {
  filteredTowns.value = townsOptions.value.filter(item => item.CODE.substring(0, 5) === cityCode);
  selectedTownCode.value = null;
  filteredVillages.value = [];
};

// 選擇鄉鎮市區時，過濾出該鄉鎮市區的村里
const onTownChange = (townCode) => {
  filteredVillages.value = villageOptions.value.filter(item => item.CODE.substring(0, 5) === townCode);
  selectedVillage.value = null;
};

// hook mounted
onMounted(async () => {
  await COUNTY_FETCH();
  await TOWN_FETCH();
  await VILLAGE_FETCH();
});

// 搜尋位置的 dialog
const openDialog = () => {
  centerDialogVisible.value = true;
};

// 搜索位置
function searchLocation() {
  // emit('search', {
  //   city: selectedCity.value,
  //   neighborhood: selectedNeighborhood.value,
  //   village: selectedVillage.value
  // });
  updateVisible(false);
}
</script>

<template>
  <div class="current-wrapper">
    <div class="left">
      <div class="title">
        <p>{{ $t('current.title') }}</p>

        <!-- 搜尋按鈕 -->
        <span class="search" @click="openDialog">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <g clip-path="url(#clip0_133_1754)">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M10.4998 2C9.14436 2.00012 7.80863 2.32436 6.60402 2.94569C5.39941 3.56702 4.36086 4.46742 3.575 5.57175C2.78914 6.67609 2.27878 7.95235 2.08647 9.29404C1.89417 10.6357 2.02551 12.004 2.46954 13.2846C2.91357 14.5652 3.65741 15.7211 4.639 16.6557C5.62059 17.5904 6.81147 18.2768 8.11228 18.6576C9.41309 19.0384 10.7861 19.1026 12.1168 18.8449C13.4475 18.5872 14.6972 18.015 15.7618 17.176L19.4138 20.828C19.6024 21.0102 19.855 21.111 20.1172 21.1087C20.3794 21.1064 20.6302 21.0012 20.8156 20.8158C21.001 20.6304 21.1062 20.3796 21.1084 20.1174C21.1107 19.8552 21.0099 19.6026 20.8278 19.414L17.1758 15.762C18.1638 14.5086 18.7789 13.0024 18.9509 11.4157C19.1228 9.82905 18.8446 8.22602 18.148 6.79009C17.4514 5.35417 16.3646 4.14336 15.0121 3.29623C13.6595 2.44911 12.0957 1.99989 10.4998 2ZM3.99977 10.5C3.99977 8.77609 4.68458 7.12279 5.90357 5.90381C7.12256 4.68482 8.77586 4 10.4998 4C12.2237 4 13.877 4.68482 15.096 5.90381C16.3149 7.12279 16.9998 8.77609 16.9998 10.5C16.9998 12.2239 16.3149 13.8772 15.096 15.0962C13.877 16.3152 12.2237 17 10.4998 17C8.77586 17 7.12256 16.3152 5.90357 15.0962C4.68458 13.8772 3.99977 12.2239 3.99977 10.5Z" fill="#4F8AAB"/>
            </g>
            <defs>
              <clipPath id="clip0_133_1754">
                <rect width="24" height="24" fill="white"/>
              </clipPath>
            </defs>
            </svg>
        </span>

        <!-- drawer 測試按鈕 -->
        <el-button class="onDrawer" @click="showDrawer = true">onDrawer</el-button>

        <el-dialog dialog v-model="centerDialogVisible" title="搜尋" width="30%" center>
          <span>
            <!-- city select -->
            <el-select v-model="selectedCityCode" :placeholder="$t('current.selectCityPlaceholder')" @change="onCityChange">
              <el-option
                v-for="item in cityOptions"
                :key="item.ID"
                :label="item.NAME"
                :value="item.CODE"
              />
            </el-select>
            
            <!-- townsOptions select -->
            <el-select v-model="selectedTownCode" :placeholder="$t('current.selectNeighborhoodPlaceholder')" @change="onTownChange">
              <el-option
                v-for="item in filteredTowns"
                :key="item.ID"
                :label="item.NAME"
                :value="item.CODE"
              />
            </el-select>
            
            <!-- village select -->
            <el-select v-model="filteredVillages" :placeholder="$t('current.selectVillagePlaceholder')">
              <el-option
                v-for="item in villageOptions"
                :label="item.NAME"
                :value="item.CODE"
              />
            </el-select>
          </span>
          
          <!-- 底部按钮 -->
          <template #footer>
            <span class="dialog-footer">
              <el-button type="primary" @click="searchLocation">搜尋</el-button>
            </span>
          </template>
        </el-dialog>

      </div>

      <!-- 候選人卡片 -->
      <div class="people-group">
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
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 投票總覽 -->
      <div class="voitView">
        <div class="icon"></div>
        <div class="voitView__content">
          <div class="title"></div>
          <div class="bar"></div>
        </div>
      </div>
      

      <!-- drawer -->
      <el-drawer v-model="showDrawer" direction="ltr" size="100%" class="nav-dialog">

        <template #close>
          <div class="custom-close-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
              <g clip-path="url(#clip0_200_5457)">
                <path d="M16 38C16 36.516 14.534 34.3 13.05 32.44C11.142 30.04 8.862 27.946 6.248 26.348C4.288 25.15 1.912 24 1.66948e-07 24M1.66948e-07 24C1.912 24 4.29 22.85 6.248 21.652C8.862 20.052 11.142 17.958 13.05 15.562C14.534 13.7 16 11.48 16 10M1.66948e-07 24L48 24" stroke="#2B2B2D" stroke-width="3"/>
              </g>
              <defs>
                <clipPath id="clip0_200_5457">
                  <rect width="48" height="48" fill="white" transform="translate(0 48) rotate(-90)"/>
                </clipPath>
              </defs>
            </svg>
          </div>
        </template>

        <template #header>
          <div class="custom-header">
            <div class="title">選區查詢</div>
          </div>
          <!-- <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
            <g clip-path="url(#clip0_200_5457)">
              <path d="M16 38C16 36.516 14.534 34.3 13.05 32.44C11.142 30.04 8.862 27.946 6.248 26.348C4.288 25.15 1.912 24 1.66948e-07 24M1.66948e-07 24C1.912 24 4.29 22.85 6.248 21.652C8.862 20.052 11.142 17.958 13.05 15.562C14.534 13.7 16 11.48 16 10M1.66948e-07 24L48 24" stroke="#2B2B2D" stroke-width="3"/>
            </g>
            <defs>
              <clipPath id="clip0_200_5457">
                <rect width="48" height="48" fill="white" transform="translate(0 48) rotate(-90)"/>
              </clipPath>
            </defs>
          </svg> -->
        </template>
        
        <div class="dialog-content">
          <!-- 左邊全區scalebar(各區票數) -->
          <div class="area-wrapper">
            <div class="search">
                <el-button class="all-btn">全臺</el-button>
                <el-select class="city-select" placeholder="縣市"></el-select>
                <el-select class="area-select" placeholder="選擇鄉鎮區"></el-select>
                <el-select class="unit-select" placeholder="選擇里"></el-select>
            </div>

            <div class="area area-left">
              <div class="left-title">
                <div class="town">鄉鎮區</div>
                <div class="win-vote">得票佔比</div>
              </div>

              <div class="left-info">
                <div class="overview-content">

                  <div class="person">
                    <span class="flag">1</span>
                    <span class="text">喵喵</span>
                  </div>

                  <div class="tag">
                    <div class="text"></div>
                  </div>

                  <div class="">
                    <span class="vote"></span>
                    <span class="bar"></span>
                  </div>
                </div>

                <div class="bar" v-for="(item, index) in testCountry" :key="index">
                  <div class="city">{{ item.city }}</div>
                  <ScaleBar
                    class="city-scale-bar"
                    :aPercent="Number(item.party1)"
                    :bPercent="Number(item.party2)"
                    :cPercent="Number(item.party3)"
                  >
                  </ScaleBar>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-drawer>
    </div>

    <!-- 右邊 -->
    <div class="right">
      <!-- map -->
      <div>
        <TaiwanMap/>
      </div>
    </div>
  </div>

  
</template>
<style lang="scss" scoped>
.current-wrapper {
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
  .left{
    width: 60%;

    @include rwd() {
      width: 100%;
    }

    .title {
      @include header1;

      @include rwd() {
        @include flex-setting($justify: space-between);
      }

      .search {
        display: none;

        @include rwd() {
          display: block;
          cursor: pointer;
        }
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


  }

  .right {
    width: 40%;
    @include rwd() {
      width: 100%;
    }
  }
}

.nav-dialog {
  background: $white !important;
  .el-drawer__close-btn {
    display: none;
    .el-icon {
      color: $white;
    }
  }
  header.el-dialog__header:deep {
    flex-direction: column-reverse;
    align-items: flex-start;
    color: #282D3A;
    gap: 38px;

    @include pad() {
      // height: 60px;
    }
    .title {
      @include header5;
      

      @include pad() {
        @include header4;
      }
    }
    // .el-dialog__headerbtn {
    //   display: none;
    // }
  }
  .dialog-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding: 20px 5px;

    .area-wrapper {
      display: flex;
      width: 80%;
      flex-direction: column;
      gap: 33px;
      margin-top: 32px;

      @include pad {
        flex-direction: column-reverse;
      }
      .area {
      }
      .area-left {
        border-radius: 20px;
        box-shadow: 0px 0px 6px 0px rgba(206, 214, 226, 0.25);
        background-color: $white;
        // width: calc(100% - 248px);
        height: 628px;
        padding: 24px;
        box-sizing: border-box;
  
        @include pad {
          width: 100%;
          height: auto;
        }
  
        .search {
          width: 100%;
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-between;
          gap: 10px;
          .all-btn {
            flex-grow: 0;
            flex-shrink: 0;
          }
          .city-select {
            min-width: 120px;
            flex-grow: 1;
            flex-shrink: 1;
            flex-basis: 0;
          }
          .area-select {
            min-width: 134px;
            flex-grow: 1;
            flex-shrink: 1;
            flex-basis: 0;
          }
          .unit-select {
            min-width: 115px;
            flex-grow: 1;
            flex-shrink: 1;
            flex-basis: 0;
          }
        }
        .left-title {
          display: flex;
          align-items: center;
          @include text5;
          color: $gray3;
          margin-top: 24px;
  
          @include pad {
            margin-top: 0;
          }
  
          .town {
            width: 81px;
          }
          .win-vote {
          }
        }
        .left-info {
          margin-top: 22px;
          height: 533px;
          overflow: auto;

          &::-webkit-scrollbar {
            display: none;
          }
          scrollbar-width: none;
  
          @media (max-width: 1357px) {
            height: 533px;
          }
          @include rwd {
            height: 533px;
          }
          @media (max-width: 820px) {
            height: 533px;
          }
          @include pad {
            margin-top: 16px;
            height: auto;
          }
          .bar {
            display: flex;
            align-items: center;
            margin-bottom: 32px;
  
            @include pad {
              margin-bottom: 28px;
            }
            .city {
              width: 95px;
              @include header5;
            }
            .city-scale-bar {
              height: 30px;
              @include pad {
                height: 24px;
              }
            }
          }

          .overview-content {
            display: flex;
            justify-content: center;
            .person {
              .flag {}
            }
          }
        }
      }
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
