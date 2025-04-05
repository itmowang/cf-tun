<template>
    <div class="p-6">
        <h2 class="text-xl font-semibold mb-4 text-gray-200">网络隧道列表</h2>

        <!-- 网络隧道列表 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="(network, index) in networks" :key="index"
                class="bg-[#2a2a2a] text-gray-200 rounded-lg shadow-md p-4 flex items-center justify-between">
                <!-- 网络信息部分 -->
                <div class="flex-1">
                    <h3 class="text-lg font-semibold mb-2">{{ network.name }}</h3>
                    <p class="text-sm text-gray-400 mb-4">速率: {{ network.speed }} Mbps</p>
                </div>

                <!-- 网络状态开关（右侧） -->
                <div class="flex items-center space-x-2">
                    <el-switch v-model="network.isActive" active-color="#13c2c2"
                        inactive-color="#f56c6c" class="ml-4" />
                    <!-- 显示文本的地方 -->
                    <span :class="network.isActive ? 'text-teal-400' : 'text-red-400'">
                        {{ network.isActive ? '开启' : '关闭' }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElSwitch } from 'element-plus';

const networks = ref([
    { name: '隧道 A', speed: 50, isActive: true },
    { name: '隧道 B', speed: 75, isActive: false },
    { name: '隧道 C', speed: 100, isActive: true },
    { name: '隧道 D', speed: 25, isActive: false },
    { name: '隧道 E', speed: 120, isActive: true },
    { name: '隧道 F', speed: 60, isActive: false }
]);
</script>

<style scoped>
/* 所有样式已由 Tailwind CSS 处理，无需额外样式 */
</style>