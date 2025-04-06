import { createRouter, createWebHashHistory } from 'vue-router';

// 使用懒加载的方式来引入路由组件
const routes = [
  { path: '/loading', component: () => import('../views/LoadingPage.vue') }, 
  { path: '/home', component: () => import('../views/HomePage.vue') }, // 默认首页
  { path: '/error', component: () => import('../views/ErrorPage.vue') },
  { path: '/networks', component: () => import('../views/Networks.vue') }, // 网络列表页
  { path: '/networks/create', component: () => import('../views/networks/create.vue') }, // 网络创建页
  { path: '/networks/ConfigureTunnel', component: () => import('../views/networks/ConfigureTunnel.vue') }, // 配置穿透页
  { path: '/setting/setting', component: () => import('../views/setting/setting.vue') }, // 网络创建页
];

export const router = createRouter({
  history: createWebHashHistory(),  // 使用 HashHistory
  routes,
});
