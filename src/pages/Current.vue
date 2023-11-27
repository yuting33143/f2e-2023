<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import ScaleBar from '@/components/scaleBar.vue';
import catImage from '@/assets/images/cat-main.png';
import dogImage from '@/assets/images/dog-main.png';
import birdImage from '@/assets/images/bird-main.png';

import birdCircle from '@/assets/images/bird-circle.png';
import catCircle from '@/assets/images/cat-circle.png';
import dogCircle from '@/assets/images/dog-circle.png';

import catBg from '@/assets/images/bg-orange.png';
import dogBg from '@/assets/images/bg-blue.png';
import birdBg from '@/assets/images/bg-green.png';
import { useWindowSizeStore } from '@/stores/windowSize.js';
import { useRegionStore } from '@/stores/regions.js';
import D3Map from '@/components/D3Map.vue';

const windowSizeStore = useWindowSizeStore();
const isMobile = computed(() => windowSizeStore.width <= 768);

// ===================== Pina 控制選票 Data 取得 ===================== //
const regionStore = useRegionStore();

// ===================== 地圖的popover資訊(在 “搜尋 dialog” 選擇完後顯示資訊) ===================== //
// 地圖的popover資訊 、people-group 的資料
const candidate = ref([
  {
    number: '1',
    president: '喵喵',
    vicePresident: '三花',
    party: '貓貓進步黨',
    img: catImage,
    circleImg: catCircle,
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
    circleImg: dogCircle,
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
    circleImg: birdCircle,
    bg: birdBg,
    color: 'green',
    vote: 608590
  }
]);

// 控制顯示 popover
const popoverUP = ref(true);

// 控制顯示 popover 的 class proportion-up
const popoverProportionUp = ref(true);

// 計算 popover 的總票數
const popoverTotalVotes = computed(() => {
  return candidate.value.reduce((sum, item) => sum + item.vote, 0);
});

// 計算 popover 的候選人百分比
const popoverCandidatePercentages = computed(() => {
  return candidate.value.map(item => ((item.vote / popoverTotalVotes.value) * 100).toFixed(2));
});

const winParty = ref('1');

// ===================== drawer dialog ===================== //
// 控制 “drawer” 跳窗
const showDrawer = ref(false);

// “drawer” 選擇框的選中值
const areaAllSelected = ref(null);
const areaCitySelected = ref(null);
const areaTownSelected = ref(null);
const areaVillageSelected = ref(null);

// “drawer” 選擇框的值（原始值）
const areaCityOptions = ref([]);
// const areaVillageOptions = ref([]);
const areaTownOptions = ref([]);

// “drawer” 選擇框的選項（filter）
const areaFilteredTowns = ref([]);
const areafilteredVillages = ref([]);

// 顯示 drawer 各縣市 data
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
  }
];
// ===================== search dialog ===================== //
// 控制 ”搜尋“ 顯示
const centerDialogVisible = ref(false);

// ”搜尋“ 選擇框的選中值
const selectedCityCode = ref(null);
const selectedTownCode = ref(null);
const selectedTownNAME = ref(null);

// ”搜尋“ 選擇框的選項(原始值)
const cityOptions = ref([]);
const townsOptions = ref([]);

// ”搜尋“ 選擇框的選項（filter）
const filteredTowns = ref([]);

// 第二區塊 bar 的資料
const candidateView = ref([
  {
    number: '1',
    party: '貓貓進步黨',
    img: catCircle,
    color: '#F5A623',
    vote: 5522119,
    strokeWidth: 26.5
  },
  {
    number: '2',
    party: '旺星人守護黨',
    img: dogCircle,
    color: '#4A90E2',
    vote: 5522119,
    strokeWidth: 26.5
  },
  {
    number: '3',
    party: '鳥類保育黨',
    img: birdCircle,
    color: '#7ED321',
    vote: 5522119,
    strokeWidth: 26.5
  }
]);

// 計算總票數
const totalVotes = computed(() => {
  return candidateView.value.reduce((sum, item) => sum + item.vote, 0);
});

// 計算候選人得票率
const candidatePercentages = computed(() => {
  return candidateView.value.map(item => ({
    ...item,
    value: Number(((item.vote / totalVotes.value) * 100).toFixed(2))
  }));
});

// 更新候選人總票數和各區域票數
function _updateCandidatesVotes(candidates, totalVotes, districtVotes) {
  candidates.forEach((candidate, index) => {
    // 確保 totalVotes 存在且包含所需的候選人票數
    if (totalVotes && totalVotes[`candidate${index + 1}`]) {
      candidate.vote = totalVotes[`candidate${index + 1}`];
    }
    
    // 根據 regionName 從 districtVotes 中獲取對應的票數
    const districtVote = districtVotes[regionStore.regionName];
    if (districtVote) {
      candidate.districtVote = districtVote[`candidate${index + 1}`];
    }
  });

  // 如果 candidateView 是一個 ref，則需要這樣訪問和更新它的值
  candidateView.value.forEach((viewItem, index) => {
    const districtVote = districtVotes[regionStore.regionName];
    if (districtVote) {
      viewItem.vote = districtVote[`candidate${index + 1}`];
    }
  });
}

const handleRegionChange = async (regionValue = 'L') => {
  const letterPart = regionValue.slice(0, 1);
  const regionCode = regionStore.regionMap[letterPart];

  if (!regionCode) {
    console.error('Invalid region code:', letterPart);
    return;
  }

  try {
    const allData = await regionStore.fetchRegionData(regionCode);
    if (!allData) {
      console.error('No data returned for region:', regionCode);
      return;
    }

    const { totalVotes, districtVotes } = regionStore.processVoteData(allData);
    console.log(totalVotes, districtVotes);
    _updateCandidatesVotes(candidate.value, totalVotes, districtVotes);
    _updateCandidatesVotes(candidateView.value, totalVotes, districtVotes);
  } catch (error) {
    console.error('Error handling region change:', error);
  }
};

// 選擇縣市時，過濾出該縣市的鄉鎮市區
const onCityChange = ID => {
  filteredTowns.value = townsOptions.value.filter(item => item.ID.slice(0, 1) === ID);
  selectedTownCode.value = null;
};


// 選擇select，更新 store 的 regionName
const searchEventHandler = regionValue => {
  handleRegionChange(regionValue);
};

/**
 * 監聽選擇框的選中值，並更新 store 的 regionName
 * 選中的縣市名稱會用於 PINIA 內部的資料查詢，並 return 該選中的鄉鎮區域
 */
// 觀察選擇框的選中值，並更新 store 的 regionName
watch(selectedCityCode, async(newVal, _) => {
  console.log(newVal);
  if (newVal) {
    await handleRegionChange(newVal);
    const selectedCity = cityOptions.value.find(item => item.ID.slice(0, 1) === newVal);
    if (selectedCity) {
      regionStore.regionName = selectedCity.NAME; // 更新 store 的 regionName
      console.log(regionStore.regionName); // 選中的 縣市名稱 會用於 PINIA內部的資料查詢
    }
  }
});

// // 當選擇鄉鎮區時，使用 Name 查找對應資料
watch(selectedTownCode, (newVal) => {
  const selectedTown = townsOptions.value.find(item => item.ID.slice(0, 3) === newVal);

  if (selectedTown) {
    selectedTownNAME.value = selectedTown.NAME;
  }

  if (newVal && selectedTownNAME.value) {
    const districtData = regionStore.districtDataAdjusted[selectedTownNAME.value];

    console.log(districtData);

    const totalVotes = regionStore.totalVotesDataAdjusted;
    selectedTownNAME.value = selectedTown.NAME

    if (districtData && totalVotes) {
      // 將找到的資料更新到 Candidate
      _updateCandidatesVotes(candidate.value, totalVotes, districtData);
      _updateCandidatesVotes(candidateView.value, totalVotes, districtData);
    }
  }
  
  // 關閉跳窗
  centerDialogVisible.value = false;
  
  // 清空選中的縣市選項
  selectedCityCode.value = null;
  selectedTownCode.value = null;
});

// ==================== 取得坐標資料 ==================== //
// 取得 市/縣 選項
const COUNTY_FETCH = async () => {
  try {
    const response = await fetch('/map/COUNTY_MOI_1090820.json');
    const jsonData = await response.json();

    cityOptions.value = jsonData.features.map(element => {
      return {
        ID: element.properties.COUNTYID,
        CODE: element.properties.COUNTYCODE,
        NAME: element.properties.COUNTYNAME
      };
    });
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
        NAME: element.properties.TOWNNAME
      };
    });
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
        NAME: element.properties.VILLAGENAME
      };
    });
    console.log(villageOptions.value);
  } catch (error) {
    console.error('失敗:', error);
  }
};

// 搜尋位置的 dialog
const openDialog = () => {
  centerDialogVisible.value = true;
};

// ==================== Data View ==================== //
// hook mounted
onMounted(async () => {
  // 取得 市/縣 坐標選項
  await COUNTY_FETCH();

  // 取得 鄉鎮市區 坐標選項
  await TOWN_FETCH();

  await handleRegionChange('L'); // 預設全選
});

// TODO: 跟d3互傳的是這個 看在把searchResults的值改成這個之類的 這裡我測試先預設了 你可以刪掉 ㄏ
const SelectArea = ref([
  { id: 'J', name: '新竹縣' },
  { id: 'J14', name: '尖石鄉' }
]);

const handleUpdateSelectArea = updatedArea => {
  SelectArea.value = updatedArea;
  // console.log('傳出來的', SelectArea.value);
};

function clickDrawer() {
  showDrawer.value = true;
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  showDrawer.value = false;
  document.body.style.overflow = '';
}
</script>

<template>
  <div class="current-wrapper">
    <div class="left">
      <div class="title">
        <p>{{ $t('current.title') }}</p>

        <!-- 搜尋按鈕 -->
        <span class="search" @click="openDialog">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <g clip-path="url(#clip0_133_1754)">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10.4998 2C9.14436 2.00012 7.80863 2.32436 6.60402 2.94569C5.39941 3.56702 4.36086 4.46742 3.575 5.57175C2.78914 6.67609 2.27878 7.95235 2.08647 9.29404C1.89417 10.6357 2.02551 12.004 2.46954 13.2846C2.91357 14.5652 3.65741 15.7211 4.639 16.6557C5.62059 17.5904 6.81147 18.2768 8.11228 18.6576C9.41309 19.0384 10.7861 19.1026 12.1168 18.8449C13.4475 18.5872 14.6972 18.015 15.7618 17.176L19.4138 20.828C19.6024 21.0102 19.855 21.111 20.1172 21.1087C20.3794 21.1064 20.6302 21.0012 20.8156 20.8158C21.001 20.6304 21.1062 20.3796 21.1084 20.1174C21.1107 19.8552 21.0099 19.6026 20.8278 19.414L17.1758 15.762C18.1638 14.5086 18.7789 13.0024 18.9509 11.4157C19.1228 9.82905 18.8446 8.22602 18.148 6.79009C17.4514 5.35417 16.3646 4.14336 15.0121 3.29623C13.6595 2.44911 12.0957 1.99989 10.4998 2ZM3.99977 10.5C3.99977 8.77609 4.68458 7.12279 5.90357 5.90381C7.12256 4.68482 8.77586 4 10.4998 4C12.2237 4 13.877 4.68482 15.096 5.90381C16.3149 7.12279 16.9998 8.77609 16.9998 10.5C16.9998 12.2239 16.3149 13.8772 15.096 15.0962C13.877 16.3152 12.2237 17 10.4998 17C8.77586 17 7.12256 16.3152 5.90357 15.0962C4.68458 13.8772 3.99977 12.2239 3.99977 10.5Z"
                fill="#4F8AAB"
              />
            </g>
            <defs>
              <clipPath id="clip0_133_1754">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </span>

        <!-- drawer 測試按鈕 -->
        <el-button class="onDrawer" @click="clickDrawer">onDrawer</el-button>

        <!-- 搜尋 dialog -->
        <el-dialog dialog v-model="centerDialogVisible" title="搜尋" width="30%" center @close="selectedCityCode = '', selectedTownCode = ''">
          <span>
            <!-- city select -->
            <el-select
              v-model="selectedCityCode"
              :placeholder="$t('current.selectCityPlaceholder')"
              @change="onCityChange(selectedCityCode), searchEventHandler(selectedCityCode)"
            >
              <el-option
                v-for="item in cityOptions"
                :key="item.ID"
                :label="item.NAME"
                :value="item.ID"
              />
            </el-select>

            <!-- townsOptions select -->
            <el-select
              v-model="selectedTownCode"
              :placeholder="$t('current.selectNeighborhoodPlaceholder')"
              @change="searchEventHandler(selectedTownCode)"
            >
              <el-option
                v-for="item in filteredTowns"
                :key="item.ID"
                :label="item.NAME"
                :value="item.ID"
              />
            </el-select>
          </span>
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
      <div class="voitView" v-if="!isMobile">
        <div
          class="voitView__item"
          v-if="candidatePercentages.length > 0"
          v-for="(item, index) in candidatePercentages"
          :key="index"
          :class="`bg-${item.color}`"
        >
          <img class="item__people" :src="item.img" :alt="item.img" />
          <div class="item__content">
            <!-- 黨派 -->
            <div class="content__title">
              <span class="number" :style="`background-color: ${item.color}`">{{
                item.number
              }}</span>
              <p class="party">{{ item.party }}</p>
            </div>

            <!-- 量表/票數 -->
            <div class="content__bar">
              <!-- bar 圖 -->
              <div class="progress">
                <el-progress
                  :key="item.id || index"
                  :percentage="item.value || 0"
                  :color="item.color || '#4F8AAB'"
                  :format="
                    () =>
                      item.vote != null && !isNaN(item.vote)
                        ? `${item.vote.toLocaleString()}票`
                        : '0票'
                  "
                  :stroke-width="item.strokeWidth || 20"
                ></el-progress>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 投票總覽 移動端 -->
      <div class="voitView voitView--isMobile" v-if="isMobile">
        <div
          class="voitView__item"
          v-if="candidatePercentages.length > 0"
          v-for="(item, index) in candidatePercentages"
          :key="index"
          :class="`bg-${item.color}`"
        >
          <div class="item__content">
            <!-- 黨派 -->
            <div class="content__title">
              <img class="item__people" :src="item.img" :alt="item.img" />
              <span class="number" :style="`background-color: ${item.color}`">{{
                item.number
              }}</span>
              <p class="party">{{ item.party }}</p>
            </div>

            <!-- 量表/票數 -->
            <div class="content__bar">
              <!-- bar 圖 -->
              <div class="progress">
                <el-progress
                  :key="item.id || index"
                  :percentage="item.value || 0"
                  :color="item.color || '#4F8AAB'"
                  :format="
                    () =>
                      item.vote != null && !isNaN(item.vote)
                        ? `${item.vote.toLocaleString()}票`
                        : '0票'
                  "
                  :stroke-width="item.strokeWidth || 20"
                ></el-progress>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- drawer -->
      <div class="nav-dialog" v-show="!isMobile" :class="{ 'dialog-open': showDrawer }">
        <!-- close -->
        <div class="custom-close-icon" @click="closeDrawer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
          >
            <g clip-path="url(#clip0_200_5457)">
              <path
                d="M16 38C16 36.516 14.534 34.3 13.05 32.44C11.142 30.04 8.862 27.946 6.248 26.348C4.288 25.15 1.912 24 1.66948e-07 24M1.66948e-07 24C1.912 24 4.29 22.85 6.248 21.652C8.862 20.052 11.142 17.958 13.05 15.562C14.534 13.7 16 11.48 16 10M1.66948e-07 24L48 24"
                stroke="#2B2B2D"
                stroke-width="3"
              />
            </g>
            <defs>
              <clipPath id="clip0_200_5457">
                <rect width="48" height="48" fill="white" transform="translate(0 48) rotate(-90)" />
              </clipPath>
            </defs>
          </svg>
        </div>

        <div class="custom-header">
          <div class="dialog-title">各區票數</div>
        </div>

        <div class="dialog-content">
          <!-- 左邊全區scalebar(各區票數) -->
          <div class="area-wrapper">
            <div class="search">
              <el-button v-model="areaAllSelected" class="all-btn">全臺</el-button>
              <el-select v-model="areaCitySelected" class="city-select" placeholder="縣市">
                <el-option
                  v-for="item in areaCityOptions"
                  :key="item.ID"
                  :label="item.NAME"
                  :value="item.CODE"
                />
              </el-select>
              <el-select v-model="areaTownSelected" class="area-select" placeholder="選擇鄉鎮區">
                <el-option
                  v-for="item in areaFilteredTowns"
                  :key="item.ID"
                  :label="item.NAME"
                  :value="item.CODE"
                />
              </el-select>
              <el-select v-model="areaVillageSelected" class="unit-select" placeholder="選擇里">
                <el-option
                  v-for="item in areafilteredVillages"
                  :key="item.ID"
                  :label="item.NAME"
                  :value="item.CODE"
                />
              </el-select>
            </div>
            <!-- <div class="overview-content">
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
            </div> -->

            <div class="area area-left">
              <div class="left-title">
                <div class="town">鄉鎮區</div>
                <div class="win-vote">得票佔比</div>
              </div>

              <div class="left-info">
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
      </div>

      <!-- 地圖的popover資訊 -->
      <div class="popover">
        <div class="popover-top">
          <div class="popover-area">台北市士林區</div>
        </div>
        <div class="popover-bottom">
          <div class="bottom-people" v-for="(item, index) in candidate" :key="index">
            <div class="one">
              <img class="img-people" :src="item.circleImg" alt="" />
            </div>
            <div class="two">
              <div class="bottom-title" :class="`bg-${item.color}-light`">
                <div class="bottom-number" :class="`bg-${item.color}`">{{ item.number }}</div>
                <div class="bottom-party" :class="`text-${item.color}`">{{ item.party }}</div>
              </div>
              <div class="bottom-vote">{{ item.vote }}票</div>
            </div>
            <div class="three">
              <div class="bottom-proportion">
                <img v-if="popoverUP" src="@/assets/images/icon/raise.png" />
                <img v-else src="@/assets/images/icon/decline.png" />
                <div class="proportion" :class="{ 'proportion-up': popoverProportionUp }">4.2%</div>
              </div>
              <div class="bottom-percent">{{ popoverCandidatePercentages[index] }}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右邊 -->
    <div class="right">
      <!-- map -->
      <D3Map :initialSelectArea="SelectArea" @updateSelectArea="handleUpdateSelectArea"></D3Map>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.current-wrapper {
  background-color: $blue-bg;
  // height: 1000px;
  padding: 60px 3%;
  display: flex;

  @include rwd() {
    flex-direction: column-reverse;
  }

  @include pad {
    padding-top: 30px;
    height: auto;
  }
  .left {
    width: 60%;

    @include rwd() {
      width: 100%;
    }

    .title {
      @include header1;
      p {
        margin-top: 0;
      }

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
              bottom: -140px;
              right: -148px;
              transform: scale(0.4);
              z-index: 3;
              @media (max-width: 1080px) {
                right: -160px;
              }
              @include pad() {
                width: 55px;
                right: auto;
                bottom: auto;
                top: 16px;
                left: 18px;
                z-index: 1;
                transform: scale(1.2);
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

    .voitView {
      @include flex-setting($direction: column, $align: flex-start);
      background-color: $white;
      margin-top: 40px;
      border-radius: 20px;
      padding: 16px 19px 14px;

      @include pad() {
        width: calc(100% - 6% - 17px);
      }
      .voitView__item {
        @include flex-setting($justify: flex-start, $align: flex-end);
        width: 100%;
        padding: 19px 0px 9px;
        border-bottom: 1px solid #f5f5f5;
        gap: 30px;
        .item__content {
          @include flex-setting($direction: column, $align: flex-start);
          width: 630px;

          .content__title {
            @include flex-setting;
            @include text4;
            gap: 12px;
            .number {
              @include flex-setting;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              color: #fff;
              font-size: 16px;
              font-weight: 700;
            }
          }
          .content__bar {
            width: 100%;
            @include flex-setting;

            .progress {
              width: 100%;
              .el-progress {
                @include header6;
                color: #282d3a;
                gap: 16px;
              }
            }
          }
        }
      }
    }

    .voitView--isMobile {
      .voitView__item {
        .item__content {
          @include flex-setting($direction: column, $align: flex-start);
        }
      }
    }
  }

  .right {
    width: 40%;
    position: fixed;
    right: 0;
    max-height: calc(100vh - 160px);
    @include rwd() {
      width: 100%;
      position: static;
      height: 600px;
      // padding-top: 69px;
    }
    @include pad {
      height: 400px;
    }
  }
}

.nav-dialog {
  background: $white !important;
  position: fixed;
  top: 99px;
  left: -610px;
  z-index: 100;
  height: calc(100% - 99px);
  padding: 40px;
  box-sizing: border-box;
  width: 600px;
  transition: 0.5s ease; // 添加这行代码

  &.dialog-open {
    left: 0px;
  }

  .custom-close-icon {
    cursor: pointer;
    margin-bottom: 20px;
  }
  .el-drawer__close-btn {
    display: none;
    .el-icon {
      color: $white;
    }
  }
  .dialog-title {
    @include header5;
  }

  .dialog-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding: 20px 5px;

    .area-wrapper {
      display: flex;
      width: 100%;
      flex-direction: column;
      gap: 20px;

      @include pad {
        flex-direction: column-reverse;
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
      .area {
      }
      .area-left {
        border-radius: 20px;
        box-shadow: 0px 0px 6px 0px rgba(206, 214, 226, 0.25);
        background-color: $white;
        // width: calc(100% - 248px);
        height: 386px;
        padding: 24px;
        box-sizing: border-box;
        overflow: auto;
        &::-webkit-scrollbar {
          display: none;
        }
        scrollbar-width: none;

        @include pad {
          width: 100%;
          height: auto;
        }

        .left-title {
          display: flex;
          align-items: center;
          @include text5;
          color: $gray3;

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
            margin-bottom: 25px;

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
              .flag {
              }
            }
          }
        }
      }
    }
  }
}

.popover {
  width: 308px;
  height: 350px;
  background-color: $white;
  box-shadow: 0px 4px 20px 0px rgba(174, 174, 174, 0.2);
  border-radius: 20px;
  box-sizing: border-box;
  .popover-top {
    border-radius: 20px;
    background-color: $black;
    height: 56px;
    color: $white;
    @include header6;
    display: flex;
    align-items: center;
    padding: 0 26px;
  }
  .popover-bottom {
    margin-top: 20px;

    padding: 0 19px 19px;
    .img-people {
      width: 33px;
    }
    .bottom-people {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      margin-top: 24px;
    }
    .bottom-title {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 10px;
      border-radius: 7px;
      margin-bottom: 8px;
      .bottom-number {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: $white;
        @include text5;
      }
      .bottom-party {
        @include text5;
      }
    }
    .bottom-vote {
      color: $black;
      @include header5;
    }
  }
  .bottom-proportion {
    display: flex;
    justify-content: flex-end;
    img {
    }
    .proportion {
      color: $gray2;
    }
    .proportion-up {
      color: $primary;
    }
  }
  .bottom-percent {
    color: $black;
  }
  .one {
  }
  .two {
  }
  .three {
    margin-left: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: end;
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

:deep(.el-dialog) {
  width: 100%;
  height: 100%;
  // margin: auto;
  background-color: rgba(255, 255, 255, 0.95);
  margin-top: 0;
  margin-bottom: 0;

  .dialog-wrapper {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .el-dialog__body {
    padding: 20% 20%;
    margin-top: 5%;

    @include mobile {
      padding: 30% 15%;
    }
  }
  .title-dialog {
    text-align: center;
    color: $black;
    @include header4;
  }
  .el-select {
    width: 100%;
  }
  .dialog-footer {
    width: 100%;
    margin-top: 30px;
    .btn {
      width: 100%;
      background-color: $primary !important;
      font-size: 18px !important;
      font-weight: 700 !important;

      &:hover {
        background-color: $secondary !important;
      }
    }
  }
  .el-dialog__close {
    color: $black;
    font-size: 20px;
  }
  .el-dialog__header {
    height: 30px;
  }
}
</style>
