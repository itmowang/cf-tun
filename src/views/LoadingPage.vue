<template>
  <div class="loading-container">
    <!-- Loading 状态 -->
    <div v-if="status === 'loading'" class="loading-message">
      <p class="text-lg font-semibold text-gray-200">正在检测 cloudflared 是否安装...</p>
      <el-loading :loading="true" text="加载中..." class="loading-spinner" />
    </div>

    <!-- Installed 状态 -->
    <div v-if="status === 'installed'" class="loading-message">
      <p class="text-lg font-semibold text-teal-500">cloudflared 已安装，正在启动应用...</p>
    </div>

    <!-- Installing 状态 -->
    <div v-if="status === 'installing'" class="loading-message">
      <p class="text-lg font-semibold text-gray-200">cloudflared 未安装，正在安装...</p>
      <el-progress :percentage="installProgress" class="progress-bar" />
    </div>

    <!-- Error 状态 -->
    <div v-if="status === 'error'" class="loading-message">
      <p class="text-lg font-semibold text-red-500">安装失败，请重试。</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

// 路由
const router = useRouter()

// 状态管理
const status = ref('loading') // loading, installed, installing, error
const installProgress = ref(0)

// 监听安装过程
onMounted(async () => {
  const result = await window.electronAPI.checkAndInstall()

  if (result.installed) {
    status.value = 'installed'
    setTimeout(() => router.push('/home'), 2000)
  } else if (result.installing) {
    status.value = 'installing'
    setInterval(() => {
      if (installProgress.value < 100) {
        installProgress.value += 5
      }
    }, 500)
  } else {
    status.value = 'error'
    setTimeout(() => router.push('/error'), 2000)
  }
})
</script>

<style scoped>
/* 整体容器样式 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
  text-align: center;
  background-color: #121212;
  padding: 0 20px;
}

/* 每条消息的样式 */
.loading-message {
  margin-bottom: 30px;
  transition: opacity 0.3s ease-in-out;
}

/* 加载中的动画效果 */
.loading-spinner {
  margin-top: 20px;
  font-size: 18px;
  color: #13c2c2;
}

/* 进度条的样式 */
.el-progress {
  width: 200px;
  margin-top: 15px;
  border-radius: 10px;
}

/* 进度条的颜色 */
.el-progress .el-progress-bar {
  background-color: #13c2c2;
  border-radius: 10px;
}
</style>
