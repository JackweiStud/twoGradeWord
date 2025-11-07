<template>
  <div id="app" class="app-container">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useGameStore } from '@/stores/gameStore'
import { useThemeStore } from '@/stores/themeStore'
import { soundManager } from '@/utils/soundManager'

const userStore = useUserStore()
const gameStore = useGameStore()
const themeStore = useThemeStore()

onMounted(async () => {
  // 初始化主题系统（优先加载，确保页面首次渲染就有正确主题）
  themeStore.initTheme()
  
  // 初始化用户数据
  userStore.loadUserData()
  
  // 加载词库数据
  await gameStore.loadWordsData()
  
  // 初始化音效设置
  const settings = userStore.settings
  if (settings) {
    soundManager.updateSettings(settings)
  }
  
  console.log('应用初始化完成 - 当前主题:', themeStore.currentTheme.name)
})
</script>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  background: var(--bg-primary);
  transition: background var(--transition-normal);
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>

