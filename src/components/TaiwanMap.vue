<template>
<svg ref="svgContainer" :width="width" :height="height"></svg>
</template>

<script>
import { onMounted, ref } from 'vue';
import * as d3 from 'd3';

export default {
name: 'TaiwanMap',

setup() {
    const width = 900; // 使用這裡定義的寬高
    const height = 1200;
    const svgContainer = ref(null);

    onMounted(() => {
        drawMap();
    });

    const drawMap = async () => {
        // 加載 GeoJSON 數據
        const taiwanGeoJSON = await d3.json('/map/COUNTY_MOI_1090820.json');

        // 創建投影
        const projection = d3.geoMercator()
            .fitSize([width, height], taiwanGeoJSON);

        // 創建地理路徑生成器
        const pathGenerator = d3.geoPath().projection(projection);

        // 繪製地圖
        const svg = d3.select(svgContainer.value);
        
        svg.selectAll('path')
            .data(taiwanGeoJSON.features)
            .join('path') // join 會處理 enter, update, exit
            .attr('d', pathGenerator)
            .attr('class', 'county')
            .append('title') // 簡易版本 tooltip
            .text(d => d.properties.COUNTYNAME); // COUNTYNAME 是 GeoJSON 裡的屬性
    };

    return {
        svgContainer,
        width,
        height
    };
}
};
</script>

<style>
.county {
    fill: #ebf0e4;
    stroke: gray;
    stroke-width: 0.1px;
}

.county:hover {
    fill: lightgray;
}
</style>
