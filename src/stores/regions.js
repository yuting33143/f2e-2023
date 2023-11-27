// store/regions.js
import { defineStore } from 'pinia';
// 取得選票資料
export const useRegionStore = defineStore('region', {
  state: () => ({
    originData: {}, // 原始資料
    totalVotes: {}, // 總票數
    districtVotes: {}, // 各地區票數
    regionName: '', // 選區名稱

    // 選區代碼對應表
    regionMap: {
      L: 'ALL', // 全國
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
    error: null // 錯誤信息
  }),

  actions: {
    async fetchRegionData(regionCode) {
      let url = regionCode === 'ALL' ? '/2020_voit/ALL.json' : `/2020_voit/city/${regionCode}.json`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP Error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid data format');
        }
        this.originData[regionCode] = data;
        this.error = null;
        return data;
      } catch (error) {
        this.error = error.toString();
        console.error('Error fetching region data:', error);
        return null;
      }
    },

    // 取得有效資料
    getValidData(jsonData) {
      return jsonData.filter(
        item =>
          item &&
          item['第15任總統副總統選舉候選人得票數一覽表'] !== '行政區別' &&
          item[`第15任總統副總統選舉候選人在${this.regionName}各鄉(鎮、市、區)得票數一覽表`] !==
            '行政區別'
      );
    },

    // 取得總票數
    getTotalVotes(validData) {
      const totalVoteEntry = validData.find(
        item =>
          item['第15任總統副總統選舉候選人得票數一覽表'] === '總　計' ||
          item[`第15任總統副總統選舉候選人在${this.regionName}各鄉(鎮、市、區)得票數一覽表`] ===
            '總　計'
      );

      return totalVoteEntry
        ? {
            candidate1: parseInt(totalVoteEntry.Column2.replace(/,/g, '') || 0),
            candidate2: parseInt(totalVoteEntry.Column3.replace(/,/g, '') || 0),
            candidate3: parseInt(totalVoteEntry.Column4.replace(/,/g, '') || 0)
          }
        : {};
    },

    // 取得各地區票數
    getDistrictVotes(validData) {
      const districtVotes = {};
      validData.forEach(item => {
        let districtNameField =
          item['第15任總統副總統選舉候選人得票數一覽表'] ||
          item[`第15任總統副總統選舉候選人在${this.regionName}各鄉(鎮、市、區)得票數一覽表`];

        if (!districtNameField) {
          return;
        }

        const districtName = districtNameField.trim();
        console.log(districtName);
        if (!['總　計', '行政區別'].includes(districtName)) {
          districtVotes[districtName] = {
            candidate1: parseInt(item.Column2.replace(/,/g, '') || 0),
            candidate2: parseInt(item.Column3.replace(/,/g, '') || 0),
            candidate3: parseInt(item.Column4.replace(/,/g, '') || 0)
          };
        }
        console.log(districtVotes);
      });

      return districtVotes;
    },

    processVoteData(jsonData) {
      if (!Array.isArray(jsonData)) {
        console.error('jsonData is not an array');
        return null;
      }

      const validData = this.getValidData(jsonData);
      const totalVotes = this.getTotalVotes(validData);
      const districtVotes = this.getDistrictVotes(validData);

      return { totalVotes, districtVotes };
    }
  }
});
