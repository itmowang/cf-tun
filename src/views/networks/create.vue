<template>
    <div class="p-6 max-w-3xl mx-auto">
      <!-- 标题 -->
      <h2 class="text-3xl font-bold text-gray-200 mb-6">创建网络隧道</h2>
  
      <!-- 表单卡片 -->
      <div class="bg-[#2a2a2a] text-gray-200 rounded-xl shadow-xl p-8 space-y-6">
        <!-- 网络名称 -->
        <div class="flex flex-col space-y-4">
          <label for="name" class="text-lg font-semibold">网络名称</label>
          <input
            v-model="form.name"
            id="name"
            type="text"
            placeholder="请输入网络名称"
            class="bg-[#1e1e1e] text-gray-200 border-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 rounded-lg p-3 w-full transition-all duration-200"
          />
          <span v-if="!form.name" class="text-red-500 text-sm">请输入网络名称</span>
        </div>
  
        <!-- 最大速率 -->
        <div class="flex flex-col space-y-4">
          <label for="speed" class="text-lg font-semibold">最大速率 (Mbps)</label>
          <input
            v-model="form.speed"
            id="speed"
            type="number"
            min="1"
            max="10000"
            placeholder="请输入速率"
            class="bg-[#1e1e1e] text-gray-200 border-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 rounded-lg p-3 w-full transition-all duration-200"
          />
          <span v-if="!form.speed" class="text-red-500 text-sm">请输入速率</span>
        </div>
  
        <!-- 提交按钮 -->
        <div class="flex justify-end gap-3">
          <router-link to="/networks">
            <button
              type="button"
              class="!px-5 !py-2 !text-base !font-semibold bg-gray-600 hover:bg-gray-700 transition-all duration-200 shadow-xl rounded-lg"
            >
              取消
            </button>
          </router-link>
  
          <button
            type="button"
            @click="submit"
            class="!px-5 !py-2 !text-base font-semibold bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 transition-all duration-200 shadow-xl rounded-lg transform hover:scale-105"
          >
            <i class="i-lucide:check mr-1"></i> 提交创建
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { ElMessage } from 'element-plus';
  
  const router = useRouter();
  
  const form = ref({
    name: '',
    speed: 100,
  });
  
  const submit = () => {
    if (!form.value.name || !form.value.speed) {
      ElMessage.error('请填写所有字段');
      return;
    }
    // 表单提交的处理逻辑
    ElMessage.success('网络隧道创建成功');
    router.push('/networks');
  };
  </script>
  
  <style scoped>
  /* 额外的自定义样式 */
  </style>
  