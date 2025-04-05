<template>
    <div class="flex flex-col h-full bg-[#121212] text-gray-200">
      <main class="flex-1 overflow-auto p-6">
        <router-view />
      </main>
      <Footer />
    </div>
  </template>
  
  <script setup>
  import Footer from './Footer.vue';
  </script>
  