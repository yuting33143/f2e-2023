<script setup>
import { ref, onMounted, watch, watchEffect } from 'vue';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import countyDataJson from '@/assets/json/country.json'; //市 COUNTY_MOI_1090820
import townDataJson from '@/assets/json/town.json'; //鄉鎮區 TOWN_MOI_1120825
import villageDataJson from '@/assets/json/village.json'; //里 VILLAGE_NLSC_121_1120928
import { useWindowSizeStore } from '@/stores/windowSize.js';

const windowSizeStore = useWindowSizeStore();

const width = ref(windowSizeStore.width);

watch(
  () => windowSizeStore.width,
  newWidth => {
    width.value = newWidth;
    mapScaleSet();
    updateMapBasedOnSelectArea(selectArea.value);
  }
);

// watch(
//   async () => windowSizeStore.width,
//   async newWidth => {
//     width.value = newWidth;
//     console.log(width.value);
//     mapScaleSet(newWidth);
//     await loadMapData();
//     updateMapBasedOnSelectArea(selectArea.value);
//   }
// );

const props = defineProps({
  initialSelectArea: Array
});

const emit = defineEmits(['updateSelectArea']);

const mapContainer = ref(null);
const path = ref(null);
const projection = ref(null);
const selectArea = ref([]);
const countyData = ref(null);
const townData = ref(null);
// const villageData = ref(null);
const geometriesCountry = ref(null);
const geometriesCountry2 = ref(null);
// const geometriesCountry3 = ref(null);
let location = [121, 24.5];
let scale = 9000;

onMounted(async () => {
  mapScaleSet();
  await loadMapData();
  if (props.initialSelectArea && props.initialSelectArea.length > 0) {
    updateMapBasedOnSelectArea(props.initialSelectArea);
  }
});

async function loadMapData() {
  selectArea.value = props.initialSelectArea || [];
  //   console.log('傳進來的', selectArea.value);
  countyData.value = await countyDataJson;
  townData.value = await townDataJson;
  //   villageData.value = await villageDataJson;
  // 載入json
  //   console.log(countyData.value);
  //   console.log(townData.value);
  //   console.log(villageData.value);
  geometriesCountry.value = feature(countyData.value, countyData.value.objects.COUNTY_MOI_1090820);
  //   console.log(geometriesCountry.value);
  geometriesCountry2.value = feature(townData.value, townData.value.objects.TOWN_MOI_1120825);
  //   console.log(geometriesCountry2.value);
  //   geometriesCountry3.value = feature(
  //     villageData.value,
  //     villageData.value.objects.VILLAGE_NLSC_121_1120928
  //   );
  //   console.log(geometriesCountry3.value);

  // 建立投影函數
  projection.value = d3
    .geoMercator()
    .center(location) // 設定適當的中心點
    .scale(scale); // 設定適當的縮放
  // .translate([300, 300]);

  // 建立地理路徑產生器
  path.value = d3.geoPath(projection.value);

  // 繪製整體縣市地圖
  d3.select('g.counties')
    .selectAll('path')
    .data(geometriesCountry.value.features)
    .enter()
    .append('path')
    .attr('class', 'county')
    .attr('d', path.value)
    .on('click', zoomToFeature);

  // 創建一個用於繪製鄉鎮區的容器
  d3.select('g.counties').append('g').attr('class', 'towns');

  // 將拖曳行為應用於地圖容器
  d3.select(mapContainer.value).call(drag);
}

function updateMapBasedOnSelectArea(initialSelectArea) {
  // 假設 initialSelectArea 包含 { id: string, name: string } 對象
  if (initialSelectArea.length === 0) return;

  const areaId = initialSelectArea[0].id;
  let areaData, zoomLevel, classToAdd;

  if (initialSelectArea.length === 1) {
    // 只有縣市資訊，定位到該縣市
    areaData = geometriesCountry.value.features.find(
      feature => feature.properties.COUNTYID === areaId
    );
    zoomLevel = 3; // 適當的縣市縮放等級
    classToAdd = 'selected';
  } else {
    // console.log('sss');
    // 縣市和鄉鎮區資訊，定位到該鄉鎮區
    const townId = initialSelectArea[1].id;
    areaData = geometriesCountry2.value.features.find(
      feature => feature.properties.TOWNID === townId
    );
    zoomLevel = 3; // 適當的鄉鎮區縮放等級
    classToAdd = 'selected-town';
  }

  if (areaData) {
    // const centroid = d3.geoPath(projection.value).centroid(areaData);
    // const x = centroid[0];
    // const y = centroid[1];

    // projection.value.center(location).scale(scale);

    path.value = d3.geoPath(projection.value);
    d3.selectAll('.county, .town').attr('d', path.value);

    d3.selectAll('.county, .town').classed('selected selected-town', false); // 清除其他選中狀態

    // 根據選擇的區域添加類別
    if (initialSelectArea[0]) {
      //   console.log('1');
      // 選擇的是縣市
      d3.selectAll('.county').each(function (d, i) {
        // console.log('11', d.properties.COUNTYID);
        // console.log('12', areaId);
        if (d && d.properties.COUNTYID === areaId) {
          d3.select(this).classed('selected', true);
        }
      });
    }
    if (initialSelectArea[1]) {
      const countyId = areaData.properties.COUNTYID;
      const townsInCounty = geometriesCountry2.value.features.filter(
        town => town.properties.COUNTYID === countyId
      );
      d3.select('g.towns')
        .selectAll('path')
        .data(townsInCounty)
        .join('path')
        .attr('class', 'town')
        .attr('d', path.value)
        .on('click', selectTown);
      //   console.log('2');
      // 選擇的是鄉鎮區
      d3.selectAll('.town').each(function (d, i) {
        // console.log(d);
        if (d && d.properties.TOWNID === initialSelectArea[1].id) {
          d3.select(this).classed('selected-town', true);
        }
      });
    }
  }
}

function zoomToFeature(event) {
  // 從被點擊的元素中獲取地區數據
  const areaData = d3.select(event.target).data()[0];
  // 檢查 areaData 是否存在並且有效
  if (areaData) {
    const countyId = areaData.properties.COUNTYID;
    const townsInCounty = geometriesCountry2.value.features.filter(
      town => town.properties.COUNTYID === countyId
    );
    // console.log('countyId', countyId);
    // console.log('townsInCounty', townsInCounty);
    // 將地區信息添加到 selectArea 中
    const newCountyId = areaData.properties.COUNTYID;
    const newCountyName = areaData.properties.COUNTYNAME;

    // 檢查是否切換到了不同的縣市
    if (selectArea.value.length === 0 || selectArea.value[0].id !== newCountyId) {
      // 清空 selectArea 並添加新的縣市信息
      selectArea.value = [{ id: newCountyId, name: newCountyName }];
    }
    emit('updateSelectArea', selectArea.value);
    console.log('selectArea.value：', selectArea.value);
    const svgRect = mapContainer.value.getBoundingClientRect();
    const relativeX = event.clientX - svgRect.left;
    const relativeY = event.clientY - svgRect.top;
    const geoCoords = projection.value.invert([relativeX, relativeY]);
    //   console.log('點擊的特徵:', event);
    //   console.log('轉換後的地理座標:', geoCoords);
    const zoomLevel = 3; // 設定適當的放大等級

    // 更新投影函數
    projection.value
      .center(geoCoords) // 重設中心點
      .scale(9000 * zoomLevel); // 更新縮放比例

    path.value = d3.geoPath(projection.value);
    // 重新繪製市區路徑

    // 只更新被點擊的縣市對應的鄉鎮區層
    d3.select('g.towns')
      .selectAll('path')
      .data(townsInCounty)
      .join('path')
      .attr('class', 'town')
      .attr('d', path.value)
      .on('click', selectTown);
    d3.selectAll('.county').attr('d', path.value);

    d3.selectAll('.county').classed('selected', false);
    d3.select(event.target).classed('selected', true);

    //   console.log('areaData', areaData);
    //   console.log('selectArea', selectArea.value);
  }
}

// 鄉鎮區的點擊事件處理器
function selectTown(event) {
  const selectedTown = d3.select(event.target).data()[0];

  // 在這裡執行當點擊鄉鎮區時的操作，例如顯示詳細資訊或進一步放大
  console.log('選擇的鄉鎮區：', selectedTown.properties.TOWNNAME);

  const newTownId = selectedTown.properties.TOWNID;
  const newTownName = selectedTown.properties.TOWNNAME;
  console.log('newTownId：', newTownId);
  console.log('newTownName：', newTownName);
  const countyId = selectArea.value[0].id;
  console.log('countyId', countyId);
  // 如果 selectArea 中已有縣市信息，則在其後添加鄉鎮區信息
  if (selectArea.value.length > 0 && selectArea.value[0].id === countyId) {
    selectArea.value[1] = { id: newTownId, name: newTownName };
  } else {
    // 否則，先添加縣市信息，然後添加鄉鎮區信息
    selectArea.value = [
      { id: countyId, name: countyName },
      { id: newTownId, name: newTownName }
    ];
  }
  emit('updateSelectArea', selectArea.value);
  //   console.log('selectArea.value：', selectArea.value);

  d3.selectAll('.town').classed('selected-town', false);
  d3.select(event.target).classed('selected-town', true);
}

// 寫拖曳
const drag = d3.drag().on('drag', event => {
  // 計算新的平移參數
  const currentTranslate = projection.value.translate();
  const newTranslate = [currentTranslate[0] + event.dx, currentTranslate[1] + event.dy];

  // 更新投影的平移參數
  projection.value.translate(newTranslate);

  // 重新繪製地圖
  d3.selectAll('.county, .town').attr('d', path.value);
});

function backToAll() {
  selectArea.value = [];
  emit('updateSelectArea', selectArea.value);

  resetMap();
}

function resetMap() {
  // 設置初始中心點和縮放比例
  projection.value.center(location).scale(scale);
  path.value = d3.geoPath(projection.value);

  // 重新繪製地圖
  d3.selectAll('.county').attr('d', path.value);
  // 移除鄉鎮區地圖層
  d3.selectAll('.town').remove();
  // 清除所有選中狀態
  d3.selectAll('.county, .town').classed('selected selected-town', false);
}

watch(
  () => props.initialSelectArea,
  (newVal, oldVal) => {
    if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
      if (newVal && newVal.length > 0) {
        updateMapBasedOnSelectArea(newVal);
      } else {
        backToAll();
      }
    }
  }
);

function mapScaleSet() {
  if (width.value >= 1700) {
    scale = 9000;
    location = [121, 24.5];
  } else if (width.value < 1700 && width.value >= 1400) {
    scale = 9000;
    location = [121.7, 23.9];
  } else if (width.value < 1400 && width.value >= 1156) {
    scale = 9000;
    location = [122.25, 23.9];
  } else if (width.value < 1156 && width.value >= 1070) {
    scale = 9000;
    location = [122.5, 23.9];
  } else if (width.value < 1070 && width.value >= 1000) {
    scale = 9000;
    location = [122.65, 23.9];
  } else if (width.value < 1000 && width.value >= 700) {
    scale = 9000;
    location = [120.7, 24];
  } else if (width.value < 700 && width.value >= 570) {
    scale = 5500;
    location = [122, 23.5];
  } else if (width.value < 570 && width.value >= 436) {
    scale = 5500;
    location = [123, 23.5];
  } else if (width.value < 436) {
    scale = 5500;
    location = [123.5, 23.5];
  }
}
</script>

<template>
  <svg ref="mapContainer" class="map-container">
    <g class="counties"></g>
    <path class="county-borders"></path>
  </svg>

  <div class="back" @click="backToAll">
    <div>回全國</div>
    <img src="@/assets/images/button/zoom-in.png" />
  </div>
</template>

<style lang="scss" scoped>
.back {
  position: fixed;
  top: 157px;
  left: 60%;
  display: flex;
  cursor: pointer;
  background-color: $white;
  width: 100px;
  height: 40px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  border-radius: 16px;
  border: 1px solid $gray4;

  &:hover {
    background-color: $gray5;
  }

  @include rwd {
    left: 3%;
    top: 170px;
    position: absolute;
  }
}
.map-container {
  height: calc(100vh - 160px);
  width: 95%;
  //   border: 1px solid black;

  @include rwd {
    height: 100%;
    width: 100%;
  }
}
:deep(.county) {
  fill: $orange;
  stroke: $white;
  stroke-width: 0.1px;

  &:hover {
    fill: $orange;
  }
}
:deep(.county):not(.inactive):hover {
  stroke-width: 1px;
  stroke: $black;
  transition: 0.5s;
}

:deep(.towns) {
  fill: $orange;
  stroke: $white;
  stroke-width: 3px;

  &:hover {
    fill: $orange;
  }
}

.counties {
  fill: $orange;
}

.counties :hover {
  stroke-width: 1px;
  stroke: $black;
  transition: 0.5s;
}
.county-borders {
  fill: none;
  stroke: #fff;
  stroke-width: 0.5px;
}

:deep(.selected) {
  stroke-width: 1px;
  stroke: $black;
}

:deep(.selected-town) {
  fill: $orange-light;
}
</style>
