<template>
    <div class="flex justify-center items-center ">
      <el-result icon="error" title="安装失败" sub-title="请手动安装 Cloudflared 后重试">
        <template #extra>
          <el-button type="primary" @click="retry">重试</el-button>
        </template>
      </el-result>
    </div>
  </template>
  
  <script setup>
  function retry() {
    window.location.reload();
  }
  </script>
  