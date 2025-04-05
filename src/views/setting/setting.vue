<template>
    <div class="p-6">
      <!-- 标题 -->
      <div class="mb-8 text-center">
        <h2 class="text-3xl font-bold text-gray-100">Cloudflare 设置</h2>
        <p class="text-gray-400 text-sm mt-2">请填写你的 Cloudflare Token 和密钥</p>
      </div>
  
      <!-- 表单卡片 -->
      <div class="bg-[#1e1e1e] border border-[#333] rounded-xl shadow-lg p-8 max-w-xl mx-auto space-y-6">
        <!-- Token -->
        <div>
          <label class="block text-gray-300 font-semibold mb-2">Token</label>
          <input
            v-model="form.token"
            type="text"
            placeholder="请输入 Cloudflare Token"
            class="w-full px-4 py-3 text-sm border border-gray-600 bg-[#2a2a2a] text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
          />
        </div>
  
        <!-- Secret -->
        <div>
          <label class="block text-gray-300 font-semibold mb-2">密钥</label>
          <input
            v-model="form.secret"
            type="password"
            placeholder="请输入密钥"
            class="w-full px-4 py-3 text-sm border border-gray-600 bg-[#2a2a2a] text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
          />
        </div>
  
        <!-- 按钮 -->
        <div class="pt-4 text-center">
          <el-button
            type="primary"
            size="large"
            class="!px-10 !py-3 !text-base !font-semibold bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            @click="save"
          >
            <i class="i-lucide:save mr-2 text-lg"></i> 保存设置
          </el-button>
  
          <transition name="fade">
            <div v-if="saved" class="text-green-400 mt-4 text-sm font-medium">✅ 设置已保存</div>
          </transition>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const form = ref({
    token: '',
    secret: ''
  })
  const saved = ref(false)
  
  onMounted(async () => {
    const config = await window.electronAPI.getConfig()
    form.value.token = config.token || ''
    form.value.secret = config.secret || ''
  })
  
  const save = async () => {
    await window.electronAPI.saveConfig({ token: form.value.token, secret: form.value.secret })
    saved.value = true
    setTimeout(() => (saved.value = false), 2000)
  }
  </script>
  
  <style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>
  