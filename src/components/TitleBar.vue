<template>
    <div class="h-10 flex items-center justify-between px-4 bg-[#1e1e1e] text-gray-300 border-b border-gray-700 drag">
      <div class="font-semibold">魔王の神秘工具 · 控制面板</div>
      <div class="flex gap-2 no-drag">
        <button @click="minimize" class="w-3 h-3 rounded-full bg-yellow-500 hover:scale-110 transition" />
        <button @click="maximize" class="w-3 h-3 rounded-full bg-green-500 hover:scale-110 transition" />
        <button @click="close" class="w-3 h-3 rounded-full bg-red-500 hover:scale-110 transition" />
      </div>
    </div>
  </template>
  
  <script setup>
  const minimize = () => window.electron.windowControl('minimize');
  const maximize = () => window.electron.windowControl('maximize');
  const close = () => window.electron.windowControl('close');
  </script>
  
  <style scoped>
  .drag {
    -webkit-app-region: drag;
  }
  .no-drag {
    -webkit-app-region: no-drag;
  }
  </style>
  