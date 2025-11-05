<template>
  <div class="difficulty-page">
    <div class="difficulty-container">
      <!-- 返回按钮 -->
      <div class="page-header">
        <AppButton
          text="← 返回"
          type="secondary"
          size="small"
          @click="goBack"
        />
        <h2 class="page-title">选择难度</h2>
      </div>

      <!-- 难度选项 -->
      <div class="difficulty-list">
        <AppCard
          v-for="diff in difficulties"
          :key="diff.id"
          :title="diff.title"
          :type="diff.type"
          clickable
          :active="selectedDifficulty === diff.id"
          class="difficulty-card"
          @click="selectDifficulty(diff.id)"
        >
          <div class="diff-info">
            <div class="diff-icon">{{ diff.icon }}</div>
            <div class="diff-details">
              <p class="diff-desc">{{ diff.description }}</p>
              <div class="diff-stats">
                <span class="diff-stat">📝 {{ diff.questionCount }} 题</span>
                <span class="diff-stat">⭐ +{{ diff.scorePerQuestion }} 分/题</span>
              </div>
              <div class="diff-types">
                <span
                  v-for="type in diff.types"
                  :key="type"
                  class="type-tag"
                >{{ type }}</span>
              </div>
            </div>
          </div>
        </AppCard>
      </div>

      <!-- 模式选择 -->
      <div class="mode-section">
        <h3 class="section-title">选择模式</h3>
        <div class="mode-list">
          <div
            v-for="mode in modes"
            :key="mode.id"
            class="mode-item"
            :class="{ 'mode-active': selectedMode === mode.id }"
            @click="selectMode(mode.id)"
          >
            <div class="mode-icon">{{ mode.icon }}</div>
            <div class="mode-name">{{ mode.name }}</div>
          </div>
        </div>
      </div>

      <!-- 开始按钮 -->
      <div class="action-buttons">
        <AppButton
          text="开始闯关"
          type="success"
          size="large"
          icon="🚀"
          :disabled="!selectedDifficulty"
          @click="startGame"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import { useUserStore } from '@/stores/userStore'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'

const router = useRouter()
const gameStore = useGameStore()
const userStore = useUserStore()

// 难度配置
const difficulties = [
  {
    id: 'simple',
    title: '🌱 简单模式',
    icon: '🌱',
    description: '仅单字练习，适合初学者',
    questionCount: 10,
    scorePerQuestion: 10,
    types: ['单字'],
    type: 'success'
  },
  {
    id: 'medium',
    title: '🌿 中等模式',
    icon: '🌿',
    description: '单字 + 双字词，巩固阶段',
    questionCount: 15,
    scorePerQuestion: 15,
    types: ['单字', '双字词'],
    type: 'warning'
  },
  {
    id: 'hard',
    title: '🌳 困难模式',
    icon: '🌳',
    description: '单字 + 双字词 + 长词组，挑战自我',
    questionCount: 20,
    scorePerQuestion: 20,
    types: ['单字', '双字词', '长词组'],
    type: 'error'
  }
]

// 模式配置
const modes = [
  { id: 'all', name: '全词库', icon: '🎯' },
  { id: 'wrong', name: '错词复习', icon: '📕' }
]

// 状态
const selectedDifficulty = ref('simple')
const selectedMode = ref('all')

// 方法
const goBack = () => {
  router.push('/')
}

const selectDifficulty = (id) => {
  selectedDifficulty.value = id
}

const selectMode = (id) => {
  selectedMode.value = id
}

const startGame = () => {
  if (!selectedDifficulty.value) return

  // 检查错词模式
  if (selectedMode.value === 'wrong') {
    const wrongWordsCount = userStore.wrongWordsStats.unmasteredCount
    if (wrongWordsCount === 0) {
      alert('错词本为空，请先完成一些题目后再使用错词复习模式')
      return
    }
  }

  // 开始游戏
  const success = gameStore.startNewGame(selectedDifficulty.value, selectedMode.value)
  
  if (success) {
    router.push('/game')
  } else {
    alert('游戏启动失败，请重试')
  }
}
</script>

<style scoped>
.difficulty-page {
  min-height: 100vh;
  padding: 20px;
}

.difficulty-container {
  max-width: 800px;
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

.difficulty-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
}

.difficulty-card {
  transition: all var(--transition-normal);
}

.diff-info {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.diff-icon {
  font-size: 48px;
  flex-shrink: 0;
}

.diff-details {
  flex: 1;
}

.diff-desc {
  font-size: var(--font-size-medium);
  color: var(--text-primary);
  margin: 0 0 12px 0;
}

.diff-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.diff-stat {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
}

.diff-types {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.type-tag {
  padding: 4px 12px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-radius: 20px;
  font-size: var(--font-size-small);
}

.mode-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: var(--font-size-large);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 20px 0;
}

.mode-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.mode-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background: var(--bg-card);
  border: 2px solid var(--bg-secondary);
  border-radius: var(--border-radius-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.mode-item:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.mode-active {
  border-color: var(--primary-color);
  background: linear-gradient(135deg, #FFF5E4 0%, #FFE8D6 100%);
  box-shadow: var(--shadow-medium);
}

.mode-icon {
  font-size: 36px;
}

.mode-name {
  font-size: var(--font-size-medium);
  font-weight: 500;
  color: var(--text-primary);
}

.action-buttons {
  display: flex;
  justify-content: center;
}

/* 响应式 */
@media (max-width: 768px) {
  .diff-info {
    flex-direction: column;
    text-align: center;
  }

  .mode-list {
    grid-template-columns: 1fr;
  }
}
</style>

