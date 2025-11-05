/**
 * 路由配置
 */
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '主页' }
  },
  {
    path: '/difficulty',
    name: 'DifficultySelect',
    component: () => import('@/views/DifficultySelect.vue'),
    meta: { title: '选择难度' }
  },
  {
    path: '/game',
    name: 'GamePlay',
    component: () => import('@/views/GamePlay.vue'),
    meta: { title: '闯关挑战' }
  },
  {
    path: '/result',
    name: 'GameResult',
    component: () => import('@/views/GameResult.vue'),
    meta: { title: '闯关结果' }
  },
  {
    path: '/wrong-words',
    name: 'WrongWords',
    component: () => import('@/views/WrongWords.vue'),
    meta: { title: '错词本' }
  },
  {
    path: '/stats',
    name: 'Stats',
    component: () => import('@/views/Stats.vue'),
    meta: { title: '学习统计' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings.vue'),
    meta: { title: '设置' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 - 更新页面标题
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || ''} - 二年级汉字闯关`
  next()
})

export default router

