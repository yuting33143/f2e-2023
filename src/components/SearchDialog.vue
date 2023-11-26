<template>
  <!-- 对话框组件，使用 v-model 控制可见状态 -->
  <el-dialog v-model:centerDialogVisible="visible" title="搜索" width="30%" center>
    
    <!-- 对话框底部 -->
    <template #footer>
      <span class="dialog-footer">
        <!-- 城市选择框 -->
        <el-select v-model="selectedCity" placeholder="选择城市">
          <el-option
            v-for="city in cityOptions"
            :key="city.value"
            :label="city.label"
            :value="city.value"
          />
        </el-select>
        <!-- 区域选择框 -->
        <el-select v-model="selectedNeighborhood" placeholder="选择区域">
          <el-option
            v-for="neighborhood in neighborhoodOptions"
            :key="neighborhood.value"
            :label="neighborhood.label"
            :value="neighborhood.value"
          />
        </el-select>
        <!-- 村/镇选择框 -->
        <el-select v-model="selectedVillage" placeholder="选择村/镇">
          <el-option
            v-for="village in villageOptions"
            :key="village.value"
            :label="village.label"
            :value="village.value"
          />
        </el-select>
        <el-button type="primary" @click="searchLocation">搜索</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

// 定义接收的属性
const props = defineProps({
  modelValue: Boolean,
  cityOptions: Array,
  neighborhoodOptions: Array,
  villageOptions: Array
});

// 定义事件发射器
const emit = defineEmits(['update:modelValue', 'search']);

// 双向绑定的响应式引用
const visible = ref(props.modelValue);
const selectedCity = ref('');
const selectedNeighborhood = ref('');
const selectedVillage = ref('');

// 监听 visible 的变化
watch(() => props.modelValue, (newVal) => {
  visible.value = newVal;
});

// 更新对话框的可见状态
function updateVisible(value) {
  emit('update:modelValue', value);
}

// 搜索位置的函数
function searchLocation() {
  emit('search', {
    city: selectedCity.value,
    neighborhood: selectedNeighborhood.value,
    village: selectedVillage.value
  });
  updateVisible(false);
}
</script>
