import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/views/index/index.vue'; // 引入你的 index.vue 组件

Vue.use(Router);

export default new Router({
  mode: 'history', // 使用 HTML5 History 模式
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    // 其他路由配置
  ]
});