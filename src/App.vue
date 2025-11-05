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

const userStore = useUserStore()
const gameStore = useGameStore()

onMounted(async () => {
  // 初始化用户数据
  userStore.loadUserData()
  
  // 加载词库数据
  await gameStore.loadWordsData()
  
  console.log('应用初始化完成')
})
</script>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #FFF5E4 0%, #FFE8D6 100%);
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

