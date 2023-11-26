// store/regions.js
import { defineStore } from 'pinia';
// 取得選票資料
export const useRegionStore = defineStore('region', {
  state: () => ({
    originData: {},
    totalVotes: {},
    districtVotes: {},

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
    },

    // 處理 選票資料格式
    processVoitData(jsonData) {
      // 確保 jsonData 是一個陣列
      if (!Array.isArray(jsonData)) {
        console.error('jsonData is not an array');
        return;
      }

      console.log(jsonData);
      let TotalVotes = {};
      let districtVotes = {};

      const validData = jsonData.filter(
        item =>
          (item != null || undefined) &&
          item['第15任總統副總統選舉候選人得票數一覽表'] !== '行政區別'
      ); // 排除 null 和 undefined 值
      console.log(validData);
      // 處理總票數
      const totalVoteEntry = validData.find(
        item => item && item['第15任總統副總統選舉候選人得票數一覽表'] === '總　計'
      );
      if (totalVoteEntry) {
        TotalVotes = {
          candidate1: parseInt(
            totalVoteEntry.Column2 ? totalVoteEntry.Column2.replace(/,/g, '') : 0
          ),
          candidate2: parseInt(
            totalVoteEntry.Column3 ? totalVoteEntry.Column3.replace(/,/g, '') : 0
          ),
          candidate3: parseInt(
            totalVoteEntry.Column4 ? totalVoteEntry.Column4.replace(/,/g, '') : 0
          )
        };
        console.log(TotalVotes);
      }

      // 處理各地區票數
      validData.forEach(item => {
        if (
          item &&
          item['第15任總統副總統選舉候選人得票數一覽表'] &&
          !item['第15任總統副總統選舉候選人得票數一覽表'].includes('總　計' || '行政區別')
        ) {
          const district = item['第15任總統副總統選舉候選人得票數一覽表'].trim();
          districtVotes[district] = {
            candidate1: parseInt(item.Column2 ? item.Column2.replace(/,/g, '') : 0),
            candidate2: parseInt(item.Column3 ? item.Column3.replace(/,/g, '') : 0),
            candidate3: parseInt(item.Column4 ? item.Column4.replace(/,/g, '') : 0)
          };
        }
      });
      console.log(TotalVotes, districtVotes);

      return { TotalVotes, districtVotes };
    }
  }
});
