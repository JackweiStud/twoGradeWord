<template>
  <div class="stats-page">
    <div class="stats-container">
      <!-- 头部 -->
      <div class="page-header">
        <AppButton
          text="← 返回"
          type="secondary"
          size="small"
          @click="goBack"
        />
        <h2 class="page-title">学习统计</h2>
      </div>

      <!-- 总体统计 -->
      <div class="overview-section">
        <AppCard
          v-for="stat in overviewStats"
          :key="stat.key"
          class="overview-card"
        >
          <div class="overview-content">
            <div class="overview-icon">{{ stat.icon }}</div>
            <div class="overview-info">
              <div class="overview-label">{{ stat.label }}</div>
              <div class="overview-value">{{ stat.value }}</div>
            </div>
          </div>
        </AppCard>
      </div>

      <!-- 最近7天游戏记录 -->
      <AppCard title="📈 最近7天学习情况" class="recent-card">
        <div v-if="recentGames.length > 0" class="recent-list">
          <div
            v-for="game in recentGames"
            :key="game.id"
            class="recent-item"
          >
            <div class="recent-date">{{ game.date }}</div>
            <div class="recent-details">
              <span class="recent-mode">{{ getDifficultyText(game.difficulty) }}</span>
              <span class="recent-score">{{ game.score }} 分</span>
              <span class="recent-accuracy" :class="getAccuracyClass(game.accuracy)">
                {{ Math.round(game.accuracy * 100) }}%
              </span>
            </div>
          </div>
        </div>
        <div v-else class="empty-recent">
          <div class="empty-icon">📚</div>
          <div class="empty-text">还没有学习记录</div>
        </div>
      </AppCard>

      <!-- 分难度统计 -->
      <AppCard title="🎯 分难度统计" class="difficulty-card">
        <div class="difficulty-stats">
          <div
            v-for="diff in difficultyStats"
            :key="diff.key"
            class="diff-stat-item"
          >
            <div class="diff-stat-header">
              <span class="diff-stat-icon">{{ diff.icon }}</span>
              <span class="diff-stat-name">{{ diff.name }}</span>
            </div>
            <div class="diff-stat-data">
              <div class="diff-stat-row">
                <span class="diff-stat-label">题目数</span>
                <span class="diff-stat-value">{{ diff.totalQuestions }}</span>
              </div>
              <div class="diff-stat-row">
                <span class="diff-stat-label">答对数</span>
                <span class="diff-stat-value">{{ diff.correctCount }}</span>
              </div>
              <div class="diff-stat-row">
                <span class="diff-stat-label">正确率</span>
                <span class="diff-stat-value" :class="getAccuracyClass(diff.accuracy)">
                  {{ Math.round(diff.accuracy * 100) }}%
                </span>
              </div>
            </div>
            <AppProgress
              :percent="diff.accuracy * 100"
              :type="getProgressType(diff.accuracy)"
              :show-info="false"
            />
          </div>
        </div>
      </AppCard>

      <!-- 最易错TOP5 -->
      <AppCard title="💔 最易错词汇 TOP5" class="top-wrong-card">
        <div v-if="topWrongWords.length > 0" class="top-wrong-list">
          <div
            v-for="(word, index) in topWrongWords"
            :key="word.id"
            class="top-wrong-item"
          >
            <div class="top-rank">{{ index + 1 }}</div>
            <div class="top-word-info">
              <div class="top-word-main">
                <span class="top-word-char">{{ word.char }}</span>
                <span class="top-word-pinyin">{{ word.pinyin }}</span>
              </div>
              <div class="top-word-source">{{ word.source }}</div>
            </div>
            <div class="top-word-count">错 {{ word.wrongCount }} 次</div>
          </div>
        </div>
        <div v-else class="empty-top">
          <div class="empty-icon">🎉</div>
          <div class="empty-text">还没有错词记录</div>
        </div>
      </AppCard>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { getTopWrongWords } from '@/utils/wrongWordsManager'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppProgress from '@/components/common/AppProgress.vue'

const router = useRouter()
const userStore = useUserStore()

// 计算属性
const overviewStats = computed(() => [
  {
    key: 'total',
    icon: '📝',
    label: '总题目数',
    value: userStore.userProgress?.totalQuestions || 0
  },
  {
    key: 'correct',
    icon: '✅',
    label: '答对数',
    value: userStore.userProgress?.correctCount || 0
  },
  {
    key: 'accuracy',
    icon: '🎯',
    label: '总正确率',
    value: `${Math.round((userStore.userProgress?.accuracy || 0) * 100)}%`
  },
  {
    key: 'time',
    icon: '⏱️',
    label: '学习时长',
    value: formatTime(userStore.userProgress?.totalStudyTime || 0)
  }
])

const recentGames = computed(() => {
  return userStore.recentGames.slice(0, 7)
})

const difficultyStats = computed(() => {
  const stats = userStore.userProgress?.difficultyStats || {}
  return [
    {
      key: 'simple',
      icon: '🌱',
      name: '简单',
      ...stats.simple
    },
    {
      key: 'medium',
      icon: '🌿',
      name: '中等',
      ...stats.medium
    },
    {
      key: 'hard',
      icon: '🌳',
      name: '困难',
      ...stats.hard
    }
  ]
})

const topWrongWords = computed(() => {
  return getTopWrongWords(5)
})

// 方法
const goBack = () => {
  router.push('/')
}

const formatTime = (seconds) => {
  if (seconds < 60) return `${seconds}秒`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟`
  return `${(seconds / 3600).toFixed(1)}小时`
}

const getDifficultyText = (difficulty) => {
  const map = {
    simple: '🌱 简单',
    medium: '🌿 中等',
    hard: '🌳 困难'
  }
  return map[difficulty] || difficulty
}

const getAccuracyClass = (accuracy) => {
  if (accuracy >= 0.85) return 'accuracy-high'
  if (accuracy >= 0.70) return 'accuracy-medium'
  return 'accuracy-low'
}

const getProgressType = (accuracy) => {
  if (accuracy >= 0.85) return 'success'
  if (accuracy >= 0.70) return 'warning'
  return 'error'
}
</script>

<style scoped>
.stats-page {
  min-height: 100vh;
  padding: 20px;
}

.stats-container {
  max-width: 900px;
  margin: 0 auto;
  animation: slideIn 0.5s ease;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.page-title {
  font-size: var(--font-size-xlarge);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.overview-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 30px;
}

.overview-card {
  padding: 20px;
}

.overview-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.overview-icon {
  font-size: 48px;
}

.overview-label {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
}

.overview-value {
  font-size: var(--font-size-xlarge);
  font-weight: 700;
  color: var(--primary-color);
}

.recent-card {
  margin-bottom: 30px;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: var(--border-radius-small);
}

.recent-date {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  min-width: 100px;
}

.recent-details {
  display: flex;
  gap: 20px;
  align-items: center;
}

.recent-mode {
  font-size: var(--font-size-small);
  color: var(--text-primary);
}

.recent-score {
  font-size: var(--font-size-small);
  font-weight: 600;
  color: var(--primary-color);
}

.recent-accuracy {
  font-size: var(--font-size-small);
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 12px;
}

.accuracy-high {
  background: var(--success-color);
  color: white;
}

.accuracy-medium {
  background: var(--warning-color);
  color: #333;
}

.accuracy-low {
  background: var(--error-color);
  color: white;
}

.difficulty-card {
  margin-bottom: 30px;
}

.difficulty-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.diff-stat-item {
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: var(--border-radius-medium);
}

.diff-stat-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.diff-stat-icon {
  font-size: 24px;
}

.diff-stat-name {
  font-size: var(--font-size-medium);
  font-weight: 600;
  color: var(--text-primary);
}

.diff-stat-data {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.diff-stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.diff-stat-label {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
}

.diff-stat-value {
  font-size: var(--font-size-small);
  font-weight: 600;
  color: var(--text-primary);
}

.top-wrong-card {
  margin-bottom: 30px;
}

.top-wrong-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.top-wrong-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: var(--border-radius-small);
}

.top-rank {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FF6B9D 0%, #FF8FB3 100%);
  color: white;
  font-size: var(--font-size-medium);
  font-weight: 700;
  border-radius: 50%;
  flex-shrink: 0;
}

.top-word-info {
  flex: 1;
}

.top-word-main {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 4px;
}

.top-word-char {
  font-size: var(--font-size-large);
  font-weight: 700;
  color: var(--text-primary);
}

.top-word-pinyin {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
}

.top-word-source {
  font-size: var(--font-size-small);
  color: var(--text-light);
}

.top-word-count {
  font-size: var(--font-size-small);
  font-weight: 600;
  color: var(--error-color);
  padding: 6px 12px;
  background: var(--bg-card);
  border-radius: 12px;
}

.empty-recent,
.empty-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: var(--font-size-medium);
  color: var(--text-secondary);
}

/* 响应式 */
@media (max-width: 768px) {
  .overview-section {
    grid-template-columns: repeat(2, 1fr);
  }

  .difficulty-stats {
    grid-template-columns: 1fr;
  }

  .recent-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .recent-details {
    width: 100%;
    justify-content: space-between;
  }
}
</style>

