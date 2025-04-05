<template>
  <div class="p-6 max-w-4xl mx-auto">
    <!-- 公告栏 -->
    <div class="bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg shadow-lg p-4 mb-6">
      <h2 class="text-xl font-semibold mb-2">最新公告</h2>
      <p class="text-sm">
        欢迎使用我们的网络隧道管理工具！请确保您已经安装了相关软件，享受更加安全、快速的网络体验。
      </p>
    </div>

    <!-- 工具介绍和作者联系（左右布局） -->
    <div class="flex flex-col sm:flex-row gap-6 sm:gap-4">
      <!-- 工具介绍模块 -->
      <div class="bg-[#2a2a2a] text-gray-200 rounded-lg shadow-md p-6 flex-1 transition-all duration-200 hover:scale-105 hover:shadow-xl">
        <h2 class="text-2xl font-semibold mb-3">工具介绍</h2>
        <p class="text-lg mb-4">
          这款工具为您提供一个简单易用的网络隧道管理系统，可以帮助您快速搭建隧道网络，并在多个设备之间共享。通过本系统，您能够实时监控和管理您的网络隧道，提供更高效的服务。
        </p>
        <ul class="list-disc list-inside space-y-2 text-sm">
          <li>实时网络速率监控</li>
          <li>网络隧道的创建与删除</li>
          <li>多隧道管理与切换功能</li>
        </ul>
      </div>

      <!-- 作者联系模块 -->
      <div class="bg-[#2a2a2a] text-gray-200 rounded-lg shadow-md p-6 flex-1 transition-all duration-200 hover:scale-105 hover:shadow-xl">
        <h2 class="text-2xl font-semibold mb-3">联系作者</h2>
        <div class="space-y-3 text-sm">
          <div class="flex items-center space-x-3">
            <i class="i-lucide:wechat text-2xl text-teal-500"></i>
            <span class="text-lg">微信: <strong>username_wechat</strong></span>
          </div>
          <div class="flex items-center space-x-3">
            <i class="i-lucide:qq text-2xl text-teal-500"></i>
            <span class="text-lg">QQ: <strong>123456789</strong></span>
          </div>
          <div class="flex items-center space-x-3">
            <i class="i-lucide:mail text-2xl text-teal-500"></i>
            <span class="text-lg">邮箱: <strong>example@example.com</strong></span>
          </div>
          <div class="flex items-center space-x-3">
            <i class="i-lucide:telegram text-2xl text-teal-500"></i>
            <span class="text-lg">Telegram: <strong>@username_tg</strong></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No additional JavaScript for this simple layout
</script>

<style scoped>
/* 已由 Tailwind CSS 和自定义类处理样式 */
</style>
