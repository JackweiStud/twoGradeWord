<template>
  <div class="result-page">
    <div class="result-container" v-if="gameResult">
      <!-- 标题 -->
      <div class="result-header">
        <h1 class="result-title">{{ resultTitle }}</h1>
        <div class="stars-display">
          <span v-for="n in stars" :key="n" class="star">⭐</span>
        </div>
      </div>

      <!-- 成绩卡片 -->
      <AppCard title="本关成绩" type="success" class="score-card">
        <div class="score-stats">
          <div class="stat-item large">
            <div class="stat-label">总得分</div>
            <div class="stat-value primary">{{ gameResult.score }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">答对题数</div>
            <div class="stat-value">{{ gameResult.correctCount }}/{{ gameResult.totalQuestions }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">正确率</div>
            <div class="stat-value">{{ accuracyPercent }}%</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">最高连对</div>
            <div class="stat-value">{{ gameResult.maxCombo }} 题</div>
          </div>
        </div>
      </AppCard>

      <!-- 得分详情 -->
      <AppCard title="🎁 得分详情" class="breakdown-card">
        <div class="breakdown-list">
          <div class="breakdown-item">
            <span class="breakdown-label">基础分</span>
            <span class="breakdown-value">+{{ scoreBreakdown.baseScore }}</span>
          </div>
          <div class="breakdown-item" v-if="scoreBreakdown.comboBonus > 0">
            <span class="breakdown-label">连对奖励</span>
            <span class="breakdown-value bonus">+{{ scoreBreakdown.comboBonus }}</span>
          </div>
          <div class="breakdown-item">
            <span class="breakdown-label">通关奖励</span>
            <span class="breakdown-value bonus">+{{ scoreBreakdown.clearBonus }}</span>
          </div>
          <div class="breakdown-divider"></div>
          <div class="breakdown-item total">
            <span class="breakdown-label">总计</span>
            <span class="breakdown-value">{{ gameResult.score }}</span>
          </div>
        </div>

        <div v-if="gameResult.wrongCount > 0" class="wrong-tip">
          ❌ 答错 {{ gameResult.wrongCount }} 题已记入错词本
        </div>
      </AppCard>

      <!-- 鼓励语 -->
      <div class="encouragement">
        <div class="encouragement-icon">{{ encouragementEmoji }}</div>
        <div class="encouragement-text">{{ encouragementText }}</div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <AppButton
          text="再来一关"
          type="primary"
          size="large"
          icon="🎮"
          @click="playAgain"
        />
        <AppButton
          text="查看错词"
          type="secondary"
          size="large"
          icon="📕"
          v-if="gameResult.wrongCount > 0"
          @click="goToWrongWords"
        />
        <AppButton
          text="返回主页"
          type="secondary"
          size="large"
          icon="🏠"
          @click="goHome"
        />
      </div>
    </div>

    <!-- 加载中 -->
    <div v-else class="loading-container">
      <div class="loading-text">加载结果中...</div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import { useUserStore } from '@/stores/userStore'
import { soundManager } from '@/utils/soundManager'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'

const router = useRouter()
const gameStore = useGameStore()
const userStore = useUserStore()

// 计算属性
const gameResult = computed(() => gameStore.gameResult)

const scoreBreakdown = computed(() => {
  return gameResult.value?.scoreBreakdown || {}
})

const accuracyPercent = computed(() => {
  if (!gameResult.value) return 0
  return Math.round(gameResult.value.accuracy * 100)
})

const stars = computed(() => {
  const acc = gameResult.value?.accuracy || 0
  if (acc >= 0.95) return 5
  if (acc >= 0.85) return 4
  if (acc >= 0.75) return 3
  if (acc >= 0.60) return 2
  return 1
})

const resultTitle = computed(() => {
  const acc = gameResult.value?.accuracy || 0
  if (acc >= 0.95) return '🎉 完美通关！'
  if (acc >= 0.85) return '🎊 太棒了！'
  if (acc >= 0.75) return '👏 表现不错！'
  if (acc >= 0.60) return '💪 继续加油！'
  return '📚 再接再厉！'
})

const encouragementEmoji = computed(() => {
  const acc = gameResult.value?.accuracy || 0
  if (acc >= 0.95) return '🏆'
  if (acc >= 0.85) return '🌟'
  if (acc >= 0.75) return '👍'
  if (acc >= 0.60) return '💪'
  return '📖'
})

const encouragementText = computed(() => {
  const acc = gameResult.value?.accuracy || 0
  if (acc >= 0.95) return '你真是学习小能手！继续保持哦！'
  if (acc >= 0.85) return '很棒的表现！再练习一下就更好了！'
  if (acc >= 0.75) return '不错的成绩！加油你会更棒的！'
  if (acc >= 0.60) return '有进步空间！多多练习就能提高哦！'
  return '没关系！多练习几次就会掌握的！'
})

// 方法
const playAgain = () => {
  soundManager.stopMusic()
  router.push('/difficulty')
}

const goToWrongWords = () => {
  soundManager.stopMusic()
  router.push('/wrong-words')
}

const goHome = () => {
  soundManager.stopMusic()
  gameStore.resetGame()
  router.push('/')
}

// 生命周期
onMounted(() => {
  if (!gameResult.value) {
    router.push('/')
    return
  }
  
  // 刷新用户数据
  userStore.refreshUserData()
  
  // 加载音效设置
  const settings = userStore.settings
  if (settings) {
    soundManager.updateSettings(settings)
  }
  
  // 播放结果页背景音乐
  soundManager.playBackgroundMusic('result')
  
  // 根据成绩播放不同的通关音效
  setTimeout(() => {
    const acc = gameResult.value.accuracy
    if (acc >= 0.95) {
      soundManager.playPerfect()
    } else {
      soundManager.playVictory()
    }
  }, 500)
})

onBeforeUnmount(() => {
  // 停止背景音乐
  soundManager.stopMusic()
})
</script>

<style scoped>
.result-page {
  min-height: 100vh;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.result-container {
  width: 100%;
  max-width: 800px;
  animation: fadeIn 0.5s ease;
}

.result-header {
  text-align: center;
  margin-bottom: 40px;
}

.result-title {
  font-size: var(--font-size-huge);
  font-weight: 700;
  background: var(--gradient-score-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
  animation: bounce 0.8s ease;
}

.stars-display {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.star {
  font-size: 36px;
  animation: bounce 0.5s ease;
  animation-fill-mode: both;
}

.star:nth-child(1) { animation-delay: 0.1s; }
.star:nth-child(2) { animation-delay: 0.2s; }
.star:nth-child(3) { animation-delay: 0.3s; }
.star:nth-child(4) { animation-delay: 0.4s; }
.star:nth-child(5) { animation-delay: 0.5s; }

.score-card {
  margin-bottom: 20px;
}

.score-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  text-align: center;
}

.stat-item {
  padding: 10px;
}

.stat-item.large {
  grid-column: span 4;
  padding: 20px;
  background: var(--gradient-question);
  border-radius: var(--border-radius-medium);
}

.stat-label {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.stat-value {
  font-size: var(--font-size-xlarge);
  font-weight: 700;
  color: var(--text-primary);
}

.stat-value.primary {
  font-size: 48px;
  color: var(--primary-color);
}

.breakdown-card {
  margin-bottom: 30px;
}

.breakdown-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: var(--border-radius-small);
}

.breakdown-item.total {
  background: var(--gradient-question);
  font-weight: 600;
  padding: 16px;
  margin-top: 8px;
}

.breakdown-label {
  font-size: var(--font-size-medium);
  color: var(--text-primary);
}

.breakdown-value {
  font-size: var(--font-size-medium);
  font-weight: 600;
  color: var(--text-primary);
}

.breakdown-value.bonus {
  color: var(--success-color);
}

.breakdown-divider {
  height: 2px;
  background: var(--bg-secondary);
  margin: 8px 0;
}

.wrong-tip {
  margin-top: 16px;
  padding: 12px;
  background: var(--gradient-wrong);
  border-radius: var(--border-radius-small);
  color: var(--error-color);
  font-size: var(--font-size-small);
  text-align: center;
}

.encouragement {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: var(--gradient-question);
  border-radius: var(--border-radius-large);
  margin-bottom: 30px;
  box-shadow: var(--shadow-light);
}

.encouragement-icon {
  font-size: 64px;
}

.encouragement-text {
  flex: 1;
  font-size: var(--font-size-large);
  color: var(--text-primary);
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}

.loading-text {
  font-size: var(--font-size-xlarge);
  color: var(--text-secondary);
  animation: pulse 1s ease infinite;
}

/* 响应式 */
@media (max-width: 768px) {
  .result-title {
    font-size: 36px;
  }

  .score-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat-item.large {
    grid-column: span 2;
  }

  .encouragement {
    flex-direction: column;
    text-align: center;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .app-button {
    width: 100%;
  }
}
</style>

