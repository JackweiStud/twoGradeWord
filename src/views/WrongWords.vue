<template>
  <div class="wrong-words-page">
    <div class="wrong-words-container">
      <!-- 头部 -->
      <div class="page-header">
        <AppButton
          text="← 返回"
          type="secondary"
          size="small"
          @click="goBack"
        />
        <h2 class="page-title">错词本</h2>
      </div>

      <!-- 统计卡片 -->
      <AppCard class="stats-card">
        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-icon">📝</div>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.totalWrongWords }}</div>
              <div class="stat-label">总错词数</div>
            </div>
          </div>
          <div class="stat-box">
            <div class="stat-icon">❌</div>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.unmasteredCount }}</div>
              <div class="stat-label">未掌握</div>
            </div>
          </div>
          <div class="stat-box">
            <div class="stat-icon">✅</div>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.masteredCount }}</div>
              <div class="stat-label">已掌握</div>
            </div>
          </div>
        </div>
      </AppCard>

      <!-- 筛选和排序 -->
      <div class="filter-bar">
        <div class="filter-group">
          <button
            v-for="filter in filters"
            :key="filter.id"
            class="filter-btn"
            :class="{ active: currentFilter === filter.id }"
            @click="setFilter(filter.id)"
          >
            {{ filter.label }}
          </button>
        </div>
        <select v-model="sortBy" class="sort-select">
          <option value="wrongCount">错误次数↓</option>
          <option value="time">时间↓</option>
        </select>
      </div>

      <!-- 错词列表 -->
      <div v-if="displayWords.length > 0" class="words-list">
        <div
          v-for="word in displayWords"
          :key="word.id"
          class="word-item"
          :class="{ mastered: word.isMastered }"
        >
          <div class="word-content">
            <div class="word-main">
              <span class="word-char">{{ word.char }}</span>
              <span class="word-pinyin">{{ word.pinyin }}</span>
            </div>
            <div class="word-meta">
              <span class="word-source">📖 {{ word.source }}</span>
              <span class="word-count">❌ {{ word.wrongCount }} 次</span>
            </div>
            <div class="word-time">
              最近错误: {{ formatDate(word.lastWrongTime) }}
            </div>
          </div>
          <div class="word-actions">
            <span v-if="word.isMastered" class="mastered-badge">✅ 已掌握</span>
            <AppButton
              v-else
              text="标记掌握"
              type="success"
              size="small"
              @click="markAsMastered(word.id)"
            />
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-icon">{{ emptyIcon }}</div>
        <div class="empty-text">{{ emptyText }}</div>
      </div>

      <!-- 底部操作 -->
      <div class="bottom-actions" v-if="displayWords.length > 0">
        <AppButton
          text="开始错词复习"
          type="primary"
          size="large"
          icon="📚"
          :disabled="statistics.unmasteredCount === 0"
          @click="startReview"
        />
        <AppButton
          text="清除已掌握"
          type="secondary"
          size="large"
          icon="🗑️"
          :disabled="statistics.masteredCount === 0"
          @click="clearMastered"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useGameStore } from '@/stores/gameStore'
import { getWrongWords, clearMastered as clearMasteredWords, markAsMastered as markWordAsMastered } from '@/utils/wrongWordsManager'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'

const router = useRouter()
const userStore = useUserStore()
const gameStore = useGameStore()

// 筛选选项
const filters = [
  { id: 'all', label: '全部' },
  { id: 'unmastered', label: '未掌握' },
  { id: 'mastered', label: '已掌握' }
]

// 状态
const currentFilter = ref('all')
const sortBy = ref('wrongCount')
const words = ref([])

// 计算属性
const statistics = computed(() => userStore.wrongWordsStats)

const displayWords = computed(() => {
  return getWrongWords(currentFilter.value, sortBy.value)
})

const emptyIcon = computed(() => {
  if (currentFilter.value === 'all') return '🎉'
  if (currentFilter.value === 'mastered') return '💪'
  return '📚'
})

const emptyText = computed(() => {
  if (currentFilter.value === 'all') return '太棒了！还没有错词'
  if (currentFilter.value === 'mastered') return '还没有掌握的错词'
  return '没有未掌握的错词'
})

// 方法
const goBack = () => {
  router.push('/')
}

const setFilter = (filter) => {
  currentFilter.value = filter
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}

const markAsMastered = (wordId) => {
  if (confirm('确定已经掌握这个词了吗？')) {
    markWordAsMastered(wordId)
    userStore.refreshUserData()
  }
}

const startReview = () => {
  // 切换到错词复习模式
  router.push({ 
    path: '/difficulty',
    query: { mode: 'wrong' }
  })
}

const clearMastered = () => {
  if (confirm(`确定要清除 ${statistics.value.masteredCount} 个已掌握的错词吗？`)) {
    const count = clearMasteredWords()
    userStore.refreshUserData()
    alert(`已清除 ${count} 个已掌握的错词`)
  }
}

// 生命周期
onMounted(() => {
  userStore.refreshUserData()
  words.value = getWrongWords('all', 'wrongCount')
})
</script>

<style scoped>
.wrong-words-page {
  min-height: 100vh;
  padding: 20px;
}

.wrong-words-container {
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

.stats-card {
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: var(--border-radius-medium);
}

.stat-icon {
  font-size: 36px;
}

.stat-info {
  flex: 1;
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

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px;
  background: var(--bg-card);
  border-radius: var(--border-radius-medium);
  box-shadow: var(--shadow-light);
}

.filter-group {
  display: flex;
  gap: 8px;
}

.filter-btn {
  padding: 8px 16px;
  background: var(--bg-secondary);
  border: 2px solid var(--bg-secondary);
  border-radius: var(--border-radius-small);
  font-size: var(--font-size-small);
  font-weight: 500;
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-btn:hover {
  border-color: var(--primary-color);
}

.filter-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.sort-select {
  padding: 8px 16px;
  background: var(--bg-secondary);
  border: 2px solid var(--bg-secondary);
  border-radius: var(--border-radius-small);
  font-size: var(--font-size-small);
  color: var(--text-primary);
  cursor: pointer;
  font-family: var(--font-family);
}

.words-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 30px;
}

.word-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: var(--bg-card);
  border-radius: var(--border-radius-medium);
  border-left: 4px solid var(--error-color);
  box-shadow: var(--shadow-light);
  transition: all var(--transition-normal);
}

.word-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.word-item.mastered {
  border-left-color: var(--success-color);
  opacity: 0.7;
}

.word-content {
  flex: 1;
}

.word-main {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 8px;
}

.word-char {
  font-size: var(--font-size-xlarge);
  font-weight: 700;
  color: var(--text-primary);
}

.word-pinyin {
  font-size: var(--font-size-medium);
  color: var(--text-secondary);
}

.word-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 4px;
}

.word-source,
.word-count {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
}

.word-time {
  font-size: var(--font-size-small);
  color: var(--text-light);
}

.word-actions {
  display: flex;
  align-items: center;
}

.mastered-badge {
  padding: 8px 16px;
  background: var(--success-color);
  color: white;
  border-radius: var(--border-radius-small);
  font-size: var(--font-size-small);
  font-weight: 500;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.empty-text {
  font-size: var(--font-size-large);
  color: var(--text-secondary);
}

.bottom-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

/* 响应式 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filter-bar {
    flex-direction: column;
    gap: 12px;
  }

  .filter-group {
    width: 100%;
    justify-content: center;
  }

  .word-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .word-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .bottom-actions {
    flex-direction: column;
  }

  .bottom-actions .app-button {
    width: 100%;
  }
}
</style>

