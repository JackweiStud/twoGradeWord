<template>
  <div class="home-page">
    <div class="home-container">
      <!-- 头部 -->
      <header class="home-header">
        <h1 class="app-title">🎓 二年级汉字闯关</h1>
        <p class="app-subtitle">快乐学习，轻松掌握</p>
      </header>

      <!-- 学习进度卡片 -->
      <AppCard title="📊 学习进度" type="primary" class="progress-card">
        <div class="progress-stats">
          <!-- 使用环形进度条显示正确率 -->
          <div class="stat-item featured">
            <AppProgress 
              :value="accuracyPercent" 
              :size="120" 
              label="正确率"
              :color="accuracyColor"
            />
          </div>
          
          <!-- 其他统计数据 -->
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
        </div>
      </AppCard>

      <!-- 主按钮 - 开始闯关 -->
      <div class="main-action">
        <AppButton
          text="🎮 开始闯关"
          type="primary"
          size="large"
          @click="startGame"
          class="start-button"
        />
      </div>

      <!-- 功能按钮网格 -->
      <div class="action-grid">
        <AppCard
          title="📕 错词本"
          :badge="wrongWordsCount"
          clickable
          type="warning"
          class="action-card"
          @click="goToWrongWords"
        >
          <p class="action-desc">复习错题，巩固知识</p>
        </AppCard>

        <AppCard
          title="📈 学习统计"
          clickable
          type="primary"
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

        <AppCard
          title="🎨 主题"
          clickable
          class="action-card"
          @click="goToTheme"
        >
          <p class="action-desc">切换界面主题</p>
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
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { soundManager } from '@/utils/soundManager'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppProgress from '@/components/common/AppProgress.vue'

const router = useRouter()
const userStore = useUserStore()

// 计算属性
const accuracyPercent = computed(() => {
  return Math.round(userStore.accuracy * 100)
})

// 根据正确率动态设置颜色
const accuracyColor = computed(() => {
  const accuracy = accuracyPercent.value
  if (accuracy >= 90) return 'var(--success)'
  if (accuracy >= 70) return 'var(--secondary)'
  if (accuracy >= 50) return 'var(--primary)'
  return 'var(--error)'
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
  soundManager.play('click')
  router.push('/difficulty')
}

const goToWrongWords = () => {
  soundManager.play('click')
  router.push('/wrong-words')
}

const goToStats = () => {
  soundManager.play('click')
  router.push('/stats')
}

const goToSettings = () => {
  soundManager.play('click')
  router.push('/settings')
}

const goToTheme = () => {
  soundManager.play('click')
  router.push('/settings')
}

// 生命周期
onMounted(() => {
  // 加载音效设置
  const settings = userStore.settings
  if (settings) {
    soundManager.updateSettings(settings)
  }
  
  // 播放主页背景音乐
  soundManager.playBackgroundMusic('home')
})

onBeforeUnmount(() => {
  // 停止背景音乐（离开主页时）
  soundManager.stopMusic()
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  padding: var(--spacing-lg);
  display: flex;
  justify-content: center;
  align-items: center;
}

.home-container {
  width: 100%;
  max-width: 900px;
  animation: fadeIn 0.6s ease;
}

.home-header {
  text-align: center;
  margin-bottom: var(--spacing-xxl);
}

.app-title {
  font-size: var(--font-size-huge);
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--spacing-sm);
  animation: bounce 1s ease;
  letter-spacing: -1px;
}

.app-subtitle {
  font-size: var(--font-size-medium);
  color: var(--text-secondary);
  font-weight: 500;
}

.progress-card {
  margin-bottom: var(--spacing-lg);
}

.progress-stats {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: var(--spacing-lg);
  align-items: center;
}

.stat-item {
  text-align: center;
  padding: var(--spacing-sm);
  transition: transform var(--transition-normal);
}

.stat-item:hover {
  transform: translateY(-4px);
}

/* 突出显示的统计项（环形进度条） */
.stat-item.featured {
  grid-column: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.stat-icon {
  font-size: 40px;
  margin-bottom: var(--spacing-sm);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.stat-value {
  font-size: var(--font-size-xlarge);
  font-weight: 700;
  color: var(--primary);
  margin-bottom: var(--spacing-xs);
  line-height: 1;
}

.stat-label {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  font-weight: 500;
}

/* 主按钮区域 */
.main-action {
  margin-bottom: var(--spacing-lg);
}

.start-button {
  width: 100%;
  font-size: var(--font-size-large);
  padding: var(--spacing-lg) var(--spacing-xl);
  border-radius: var(--radius-large);
  box-shadow: var(--shadow-heavy);
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
  position: relative;
  overflow: hidden;
}

.start-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  50%, 100% {
    left: 100%;
  }
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.action-card {
  transition: all var(--transition-normal);
  min-height: 100px;
}

.action-desc {
  margin: var(--spacing-sm) 0 0 0;
  color: var(--text-secondary);
  font-size: var(--font-size-small);
  line-height: 1.5;
}

.tip-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%);
  border-radius: var(--radius-large);
  border-left: 4px solid var(--info);
  box-shadow: var(--shadow-light);
  animation: slideIn 0.5s ease;
}

.welcome-tip {
  border-left: 4px solid var(--primary);
}

.tip-icon {
  font-size: 48px;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.tip-content {
  flex: 1;
}

.tip-title {
  font-size: var(--font-size-medium);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.tip-text {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  line-height: 1.6;
}

/* 响应式 */
@media (max-width: 768px) {
  .home-page {
    padding: var(--spacing-md);
  }

  .progress-stats {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .stat-item.featured {
    grid-column: 1;
  }

  .action-grid {
    grid-template-columns: 1fr;
  }

  .app-title {
    font-size: var(--font-size-xlarge);
  }

  .tip-icon {
    font-size: 36px;
  }
}
</style>

