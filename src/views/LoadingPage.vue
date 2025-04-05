<template>
    <div class="loading-container">
      <div v-if="status === 'loading'" class="loading-message">
        <p>正在检测 cloudflared 是否安装...</p>
        <el-loading :loading="true" text="加载中..." />
      </div>
  
      <div v-if="status === 'installed'" class="loading-message">
        <p>cloudflared 已安装，正在启动应用...</p>
      </div>
  
      <div v-if="status === 'installing'" class="loading-message">
        <p>cloudflared 未安装，正在安装...</p>
        <el-progress :percentage="installProgress" />
      </div>
  
      <div v-if="status === 'error'" class="loading-message">
        <p>安装失败，请重试。</p>
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
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    flex-direction: column;
    text-align: center;
  }
  
  .loading-message {
    margin-bottom: 20px;
  }
  
  .el-progress {
    width: 100px;
  }
  </style>
  