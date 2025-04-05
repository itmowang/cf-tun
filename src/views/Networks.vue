<template>
  <div class="p-6">
    <!-- 顶部标题和按钮区域 -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
      <h2 class="text-2xl font-bold text-gray-200">网络隧道列表</h2>

      <!-- 按钮组 -->
      <div class="flex items-center gap-4 justify-center">
        <router-link to="/networks/create">
          <el-button type="primary" size="large" round
            class="!px-8 !py-4 !text-lg !font-semibold bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105">
            <i class="i-lucide:plus mr-2 text-lg"></i> 创建网络
          </el-button>
        </router-link>

        <template v-if="!deleteMode">
          <el-button type="danger" size="large" round
            class="!px-8 !py-4 !text-lg !font-semibold bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
            @click="deleteMode = true">
            <i class="i-lucide:trash-2 mr-2 text-lg"></i> 删除网络
          </el-button>
        </template>

        <template v-else>
          <el-button type="danger" size="large" round :disabled="!hasSelection"
            class="!px-8 !py-4 !text-lg font-semibold transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
            @click="confirmDelete">
            ✅ 确认删除
          </el-button>

          <el-button size="large" round class="!px-8 !py-4 !text-lg font-semibold transition-all duration-200 shadow"
            @click="cancelDeleteMode">
            取消
          </el-button>
        </template>
      </div>
    </div>

    <!-- 网络隧道列表 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="(network, index) in networks" :key="index"
        class="bg-[#2a2a2a] text-gray-200 rounded-lg shadow-md p-4 cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.01] flex items-center"
        :class="{
          'ring-2 ring-red-500': deleteMode && selected.includes(index),
          'ring-2 ring-transparent': deleteMode && !selected.includes(index)
        }" @click="deleteMode ? toggleSelection(index) : null">
        <div class="flex justify-between items-center w-full">
          <!-- 网络信息 -->
          <div class="flex-1">
            <h3 class="text-lg font-semibold mb-1">{{ network.name }}</h3>
            <p class="text-sm text-gray-400 mb-1">速率: {{ network.speed }} Mbps</p>
          </div>

          <!-- 状态开关与状态文字（右侧居中） -->
          <div class="flex flex-col items-center justify-center space-y-1">
            <el-switch v-model="network.isActive" active-color="#13c2c2" inactive-color="#f56c6c" @change="handleSwitchChange(network, $event)" />
            <span :class="network.isActive ? 'text-teal-400' : 'text-red-400'" class="text-sm">
              {{ network.isActive ? '开启' : '关闭' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { ElMessage } from 'element-plus';

const deleteMode = ref(false);
const selected = ref([]);
const networks = ref([]);

// API Token 和 User ID 的状态变量
const state = reactive({
  apiToken: null,
  accountId: null,  // Cloudflare Account ID
  loading: false,   // 按钮加载状态
});

onMounted(async () => {
  const config = await window.electronAPI.getConfig();
  if (!config) {
    ElMessage.error('配置文件未找到，请检查设置');
    return;
  }
  state.apiToken = config.token || null;
  state.accountId = config.userId || null;
  console.log('Config:', config);
  fetchTunnels();
});

// 获取隧道列表
const fetchTunnels = async () => {
  try {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${state.accountId}/cfd_tunnel`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${state.apiToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching tunnels: ${response.statusText}`);
    }

    const data = await response.json();
    networks.value = data.result;
    ElMessage.success('隧道加载成功');
  } catch (error) {
    ElMessage.error('获取隧道列表失败');
    console.error('Error fetching tunnels:', error);
  }
};

// 获取隧道令牌
const fetchTunnelToken = async (tunnelId) => {
  try {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${state.accountId}/cfd_tunnel/${tunnelId}/token`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${state.apiToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching tunnel token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.result; // 返回获取到的 tunnel-token
  } catch (error) {
    ElMessage.error('获取隧道令牌失败');
    console.error('Error fetching tunnel token:', error);
  }
};

// 切换隧道开关状态时调用此函数
const handleSwitchChange = async (network, newState) => {
  if (newState) {
    // 获取隧道令牌并启动隧道
    const tunnelToken = await fetchTunnelToken(network.id);
    try {
      console.log(tunnelToken);
      
      await window.electronAPI.startTunnel(tunnelToken);
      ElMessage.success(`隧道 ${network.name} 已启动`);
    } catch (error) {
      console.error('Error starting tunnel:', error);
      ElMessage.error(`启动隧道 ${network.name} 失败`);
    }
  } else {
    // 关闭隧道的逻辑可以在此处添加
    ElMessage.info(`隧道 ${network.name} 已关闭`);
  }
};

// 切换选中状态
const toggleSelection = (index) => {
  if (selected.value.includes(index)) {
    selected.value = selected.value.filter(i => i !== index);
  } else {
    selected.value.push(index);
  }
};

// 判断是否有选中的隧道
const hasSelection = computed(() => selected.value.length > 0);

// 取消删除模式
const cancelDeleteMode = () => {
  deleteMode.value = false;
  selected.value = [];
};

// 确认删除选中的隧道
const confirmDelete = () => {
  networks.value = networks.value.filter((_, i) => !selected.value.includes(i));
  cancelDeleteMode();
};
</script>

<style scoped>
/* 额外的自定义样式 */
</style>
