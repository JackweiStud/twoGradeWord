<template>
  <div class="home-page">
    <div class="home-container">
      <!-- 头部 -->
      <header class="home-header">
        <h1 class="app-title">🎓 二年级汉字闯关</h1>
        <p class="app-subtitle">快乐学习，轻松掌握</p>
      </header>

      <!-- 学习进度卡片 -->
      <AppCard title="学习进度" type="primary" class="progress-card">
        <div class="progress-stats">
          <div class="stat-item">
            <div class="stat-icon">🏆</div>
            <div class="stat-value">{{ userStore.totalScore }}</div>
            <div class="stat-label">总分</div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">⭐</div>
            <div class="stat-value">{{ userStore.stars }}</div>
            <div class="stat-label">星星</div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">📚</div>
            <div class="stat-value">{{ userStore.masteredWordsCount }}</div>
            <div class="stat-label">掌握词汇</div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">🎯</div>
            <div class="stat-value">{{ accuracyPercent }}%</div>
            <div class="stat-label">正确率</div>
          </div>
        </div>
      </AppCard>

      <!-- 功能按钮 -->
      <div class="action-grid">
        <AppCard
          title="🎮 开始闯关"
          clickable
          class="action-card"
          @click="startGame"
        >
          <p class="action-desc">挑战汉字，提升能力</p>
        </AppCard>

        <AppCard
          title="📕 错词本"
          :badge="wrongWordsCount"
          clickable
          class="action-card"
          @click="goToWrongWords"
        >
          <p class="action-desc">复习错题，巩固知识</p>
        </AppCard>

        <AppCard
          title="📊 学习统计"
          clickable
          class="action-card"
          @click="goToStats"
        >
          <p class="action-desc">查看进度，分析数据</p>
        </AppCard>

        <AppCard
          title="⚙️ 设置"
          clickable
          class="action-card"
          @click="goToSettings"
        >
          <p class="action-desc">个性化你的学习</p>
        </AppCard>
      </div>

      <!-- 今日学习提示 -->
      <div class="tip-card" v-if="recentGames.length > 0">
        <div class="tip-icon">💡</div>
        <div class="tip-content">
          <div class="tip-title">今日已学习</div>
          <div class="tip-text">
            完成了 {{ todayGamesCount }} 关，答对 {{ todayCorrectCount }} 题，继续加油！
          </div>
        </div>
      </div>
      <div class="tip-card welcome-tip" v-else>
        <div class="tip-icon">👋</div>
        <div class="tip-content">
          <div class="tip-title">欢迎来到汉字闯关</div>
          <div class="tip-text">点击"开始闯关"开始你的学习之旅吧！</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import AppCard from '@/components/common/AppCard.vue'

const router = useRouter()
const userStore = useUserStore()

// 计算属性
const accuracyPercent = computed(() => {
  return Math.round(userStore.accuracy * 100)
})

const wrongWordsCount = computed(() => {
  return userStore.wrongWordsStats.unmasteredCount > 0
    ? userStore.wrongWordsStats.unmasteredCount.toString()
    : ''
})

const recentGames = computed(() => userStore.recentGames)

const todayGamesCount = computed(() => {
  const today = new Date().toLocaleDateString('zh-CN')
  return recentGames.value.filter(g => g.date === today).length
})

const todayCorrectCount = computed(() => {
  const today = new Date().toLocaleDateString('zh-CN')
  return recentGames.value
    .filter(g => g.date === today)
    .reduce((sum, g) => sum + g.correctCount, 0)
})

// 方法
const startGame = () => {
  router.push('/difficulty')
}

const goToWrongWords = () => {
  router.push('/wrong-words')
}

const goToStats = () => {
  router.push('/stats')
}

const goToSettings = () => {
  router.push('/settings')
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.home-container {
  width: 100%;
  max-width: 800px;
  animation: fadeIn 0.5s ease;
}

.home-header {
  text-align: center;
  margin-bottom: 40px;
}

.app-title {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
  animation: bounce 1s ease;
}

.app-subtitle {
  font-size: var(--font-size-medium);
  color: var(--text-secondary);
}

.progress-card {
  margin-bottom: 30px;
}

.progress-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  text-align: center;
}

.stat-item {
  padding: 10px;
}

.stat-icon {
  font-size: 36px;
  margin-bottom: 8px;
}

.stat-value {
  font-size: var(--font-size-xlarge);
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 4px;
}

.stat-label {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.action-card {
  transition: all var(--transition-normal);
}

.action-card:hover {
  transform: translateY(-4px) scale(1.02);
}

.action-desc {
  margin: 10px 0 0 0;
  color: var(--text-secondary);
  font-size: var(--font-size-small);
}

.tip-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #FFF9F0 0%, #FFF5E4 100%);
  border-radius: var(--border-radius-large);
  border-left: 4px solid var(--info-color);
  box-shadow: var(--shadow-light);
}

.welcome-tip {
  border-left: 4px solid var(--primary-color);
}

.tip-icon {
  font-size: 48px;
}

.tip-title {
  font-size: var(--font-size-medium);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.tip-text {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
}

/* 响应式 */
@media (max-width: 768px) {
  .progress-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .action-grid {
    grid-template-columns: 1fr;
  }

  .app-title {
    font-size: 36px;
  }
}
</style>

