<template>
  <aside class="h-full bg-[#1e1e1e] text-gray-200 border-r border-gray-700 flex flex-col">
    <div class="flex flex-col items-center py-6 border-b border-gray-700">
      <!-- https://i.pravatar.cc/100 -->
      <img src="https://avatars.githubusercontent.com/u/137391282?v=4" alt="avatar" class="w-20 h-20 rounded-full border border-gray-500 shadow-md" />
      <p class="mt-4 text-sm text-gray-400">欢迎回来</p>
    </div>

    <nav class="flex-1 overflow-auto mt-4">
      <ul class="space-y-1 px-2">
        <li v-for="item in menu" :key="item.path">
          <router-link
            :to="item.path"
            class="flex items-center px-4 py-3 rounded-lg border transition-all duration-200 hover:border-blue-500 hover:bg-[#2a2a2a]"
            :class="{
              'bg-[#2a2a2a] border-blue-500 text-blue-400': isActive(item.path),
              'border-transparent': !isActive(item.path)
            }"
          >
            <i :class="item.icon + ' mr-3'" />
            <span>{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- 主题切换 -->
    <div class="p-4 border-t border-gray-700">
      <button
        class="w-full py-2 bg-gray-800 text-sm rounded hover:bg-gray-700 transition"
        @click="toggleTheme"
      >
        切换主题  当前：{{ theme }} 
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useTheme } from '@/composables/useTheme';

const route = useRoute();
const { theme, toggleTheme } = useTheme();

const menu = [
  { label: '首页', path: '/home', icon: 'i-lucide-home' },
  { label: '网络列表', path: '/networks', icon: 'i-lucide-list' }, 
  { label: '设置', path: '/setting/setting', icon: 'i-lucide-settings' },
  { label: '关于', path: '/about', icon: 'i-lucide-info' }
];

const isActive = (path) => route.path === path;
</script>
