<template>
  <div class="h-screen w-screen bg-white dark:bg-[#121212] text-black dark:text-white">
    <el-container class="h-full">
      <el-aside width="220px" class="!bg-transparent">
        <Aside />
      </el-aside>

      <el-container direction="vertical">
        <TitleBar />
        <el-main class="!p-0">
          <MainLayout />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import './styles/global.css';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Aside from '@/components/Aside.vue';
import MainLayout from '@/components/MainLayout.vue';
import TitleBar from '@/components/TitleBar.vue';

const router = useRouter();
const status = ref('loading');

onMounted(async () => {
  try {
    const isCloudflaredInstalled = await window.electron.checkCloudflared();
    status.value = isCloudflaredInstalled ? 'home' : 'installing';
    router.push(isCloudflaredInstalled ? '/home' : '/loading');
  } catch (error) {
    console.error('Error:', error);
    status.value = 'error';
    router.push('/error');
  }
});
</script>
