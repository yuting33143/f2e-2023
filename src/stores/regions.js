// store/regions.js
import { defineStore } from 'pinia';
// 取得選票資料
export const useRegionStore = defineStore('region', {
  state: () => ({
    originData: {},

    // 選區代碼對應表
    regionMap: {
      ALL: 'ALL', // 全國
      A: 'TaipeiCity', // 臺北市
      B: 'TaizhongCity', // 臺中市
      G: 'YilanCounty', // 宜蘭
      X: 'PenghuCounty', // 澎湖縣
      D: 'TainanCity', // 臺南市
      V: 'TaitungCounty', // 臺東縣
      N: 'ZhangHuaCounty', // 彰化縣
      Q: 'JiayiCounty', // 嘉義縣
      I: 'JiayiCity', // 嘉義市
      J: 'XinzhuCounty', // 新竹縣
      O: 'XinzhuCity', // 新竹市
      F: 'NewTaipeiCity', // 新北市
      P: 'YunlinCounty', // 雲林縣
      Z: 'LianjiangCounty', // 連江縣
      C: 'JilongCity', // 基隆市
      E: 'GaoxuiongCity', // 高雄市
      H: 'TaoyuanCity', // 桃園市
      K: 'MiaoliCounty', // 苗栗縣
      T: 'PingdongCounty', // 屏東縣
      M: 'NantouCounty', // 南投縣
      W: 'JinmenCounty', // 金門縣
      U: 'HualianCounty' // 花蓮縣
    },
    error: null
  }),
  actions: {
    async fetchRegionData(regionCode) {
      let url;
      if (regionCode === 'ALL') {
        url = '/2020_voit/ALL.json';
      } else {
        url = `/2020_voit/city/${regionCode}.json`;
      }
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP Error! status: ${response.status}`); // 檢查響應狀態
        }
        const data = await response.json();

        // 存儲 data
        this.originData[regionCode] = data;

        // 如果成功則重置錯誤
        this.error = null;

        // 添加返回值
        return this.originData[regionCode];
      } catch (error) {
        this.error = error.toString(); // 存儲錯誤信息
        console.error('Error fetching region data:', error);
      }
    }
  }
});
