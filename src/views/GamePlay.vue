<template>
  <div class="game-page">
    <div class="game-container" v-if="gameStore.gameStarted && !gameStore.gameFinished">
      <!-- 顶部信息栏 -->
      <div class="game-header">
        <AppButton
          text="← 退出"
          type="secondary"
          size="small"
          @click="confirmExit"
        />
        <div class="game-info">
          <span class="question-number">
            第 {{ gameStore.currentQuestionIndex + 1 }}/{{ gameStore.totalQuestions }} 题
          </span>
          <span class="score-display">
            ⭐ {{ currentScore }} 分
          </span>
        </div>
      </div>

      <!-- 进度条 -->
      <AppProgress
        :percent="gameStore.progress"
        label="闯关进度"
        type="primary"
        :show-info="false"
        class="game-progress"
      />

      <!-- 题目区域 -->
      <div class="question-container" v-if="currentQuestion">
        <div class="question-header">
          <h3 class="question-title">
            {{ currentQuestion.mode === 'A' ? '请选择正确的汉字' : '请选择正确的拼音' }}
          </h3>
        </div>

        <!-- 题目显示 -->
        <div class="question-display" :class="answerAnimation">
          <div v-if="currentQuestion.mode === 'A'" class="question-text">
            {{ currentQuestion.correct.pinyin }}
          </div>
          <div v-else class="question-text">
            {{ currentQuestion.correct.text }}
          </div>
        </div>

        <!-- 选项区域 -->
        <div class="options-grid">
          <div
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            class="option-item"
            :class="{
              'option-selected': selectedAnswer === option,
              'option-correct': showResult && option.isCorrect,
              'option-wrong': showResult && selectedAnswer === option && !option.isCorrect
            }"
            @click="selectAnswer(option)"
          >
            <div class="option-content">
              {{ currentQuestion.mode === 'A' ? option.text : option.pinyin }}
            </div>
          </div>
        </div>

        <!-- 答题反馈 -->
        <div v-if="showResult" class="result-feedback">
          <div v-if="isCorrect" class="feedback-correct">
            <div class="feedback-icon">✅</div>
            <div class="feedback-text">太棒了！</div>
          </div>
          <div v-else class="feedback-wrong">
            <div class="feedback-icon">❌</div>
            <div class="feedback-text">
              正确答案是：{{ currentQuestion.mode === 'A' 
                ? currentQuestion.correct.text 
                : currentQuestion.correct.pinyin }}
            </div>
          </div>
        </div>

        <!-- 连对提示 -->
        <div v-if="gameStore.currentCombo >= 3" class="combo-display">
          🔥 连对 {{ gameStore.currentCombo }} 题！
        </div>
      </div>

      <!-- 下一题按钮 -->
      <div v-if="showResult" class="action-area">
        <AppButton
          :text="gameStore.isLastQuestion ? '查看结果' : `下一题 (${countdown}s)`"
          type="success"
          size="large"
          icon="→"
          @click="nextQuestion"
        />
      </div>
    </div>

    <!-- 加载中 -->
    <div v-else-if="!gameStore.gameStarted" class="loading-container">
      <div class="loading-text">加载中...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import AppButton from '@/components/common/AppButton.vue'
import AppProgress from '@/components/common/AppProgress.vue'

const router = useRouter()
const gameStore = useGameStore()

// 状态
const selectedAnswer = ref(null)
const showResult = ref(false)
const isCorrect = ref(false)
const answerAnimation = ref('')
const currentScore = ref(0)
const startTime = ref(Date.now())
const autoNextTimer = ref(null)
const countdown = ref(3)

// 计算属性
const currentQuestion = computed(() => gameStore.currentQuestion)

// 方法
const selectAnswer = (answer) => {
  if (showResult.value || !answer) return

  selectedAnswer.value = answer
  
  // 提交答案
  const result = gameStore.submitAnswer(answer)
  isCorrect.value = result
  showResult.value = true

  // 播放动画
  if (result) {
    answerAnimation.value = 'pulse'
    currentScore.value += getCurrentQuestionScore()
  } else {
    answerAnimation.value = 'shake'
  }

  // 清除动画
  setTimeout(() => {
    answerAnimation.value = ''
  }, 500)

  // 启动3秒自动跳转倒计时
  startAutoNextTimer()
}

const getCurrentQuestionScore = () => {
  const scoreMap = { simple: 10, medium: 15, hard: 20 }
  return scoreMap[gameStore.currentDifficulty] || 10
}

const startAutoNextTimer = () => {
  // 清除之前的计时器
  clearAutoNextTimer()
  
  // 重置倒计时
  countdown.value = 3
  
  // 启动倒计时
  autoNextTimer.value = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearAutoNextTimer()
      nextQuestion()
    }
  }, 1000)
}

const clearAutoNextTimer = () => {
  if (autoNextTimer.value) {
    clearInterval(autoNextTimer.value)
    autoNextTimer.value = null
  }
}

const nextQuestion = () => {
  // 清除自动跳转计时器
  clearAutoNextTimer()
  
  const hasNext = gameStore.nextQuestion()
  
  if (!hasNext) {
    // 游戏结束，跳转到结果页
    router.push('/result')
  } else {
    // 重置状态
    selectedAnswer.value = null
    showResult.value = false
    isCorrect.value = false
    countdown.value = 3
  }
}

const confirmExit = () => {
  if (confirm('确定要退出吗？当前进度将不会保存。')) {
    gameStore.resetGame()
    router.push('/')
  }
}

// 生命周期
onMounted(() => {
  if (!gameStore.gameStarted) {
    router.push('/difficulty')
  }
  startTime.value = Date.now()
})

onBeforeUnmount(() => {
  // 清除自动跳转计时器
  clearAutoNextTimer()
  
  // 计算学习时长
  const duration = Math.floor((Date.now() - startTime.value) / 1000)
  console.log('本次学习时长:', duration, '秒')
})
</script>

<style scoped>
.game-page {
  min-height: 100vh;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.game-container {
  width: 100%;
  max-width: 800px;
  animation: fadeIn 0.5s ease;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.game-info {
  display: flex;
  gap: 20px;
  align-items: center;
}

.question-number {
  font-size: var(--font-size-medium);
  font-weight: 600;
  color: var(--text-primary);
}

.score-display {
  font-size: var(--font-size-medium);
  font-weight: 600;
  color: var(--primary-color);
}

.game-progress {
  margin-bottom: 30px;
}

.question-container {
  background: var(--bg-card);
  border-radius: var(--border-radius-large);
  padding: 24px;
  box-shadow: var(--shadow-medium);
  margin-bottom: 16px;
}

.question-header {
  text-align: center;
  margin-bottom: 16px;
}

.question-title {
  font-size: var(--font-size-large);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.question-display {
  text-align: center;
  margin-bottom: 35px;
  padding: 35px;
  background: linear-gradient(135deg, #FFF9F0 0%, #FFF5E4 100%);
  border-radius: var(--border-radius-large);
}

.question-text {
  font-size: 42px;
  font-weight: 700;
  color: var(--primary-color);
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.option-item {
  padding: 24px;
  background: var(--bg-card);
  border: 3px solid var(--bg-secondary);
  border-radius: var(--border-radius-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
  text-align: center;
}

.option-item:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.option-content {
  font-size: var(--font-size-xlarge);
  font-weight: 600;
  color: var(--text-primary);
}

.option-selected {
  border-color: var(--primary-color);
  background: linear-gradient(135deg, #FFF5E4 0%, #FFE8D6 100%);
}

.option-correct {
  border-color: var(--success-color);
  background: linear-gradient(135deg, #E8F8F5 0%, #D5F5E8 100%);
  animation: pulse 0.5s ease;
}

.option-wrong {
  border-color: var(--error-color);
  background: linear-gradient(135deg, #FFE8E8 0%, #FFD5D5 100%);
  animation: shake 0.5s ease;
}

.result-feedback {
  text-align: center;
  padding: 20px;
  border-radius: var(--border-radius-medium);
  animation: fadeIn 0.3s ease;
}

.feedback-correct {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--success-color);
}

.feedback-wrong {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--error-color);
}

.feedback-icon {
  font-size: 40px;
}

.feedback-text {
  font-size: var(--font-size-large);
  font-weight: 600;
}

.combo-display {
  text-align: center;
  margin-top: 16px;
  padding: 10px;
  background: linear-gradient(135deg, #FFD93D 0%, #FFE16D 100%);
  border-radius: var(--border-radius-medium);
  font-size: var(--font-size-large);
  font-weight: 600;
  color: #333;
  animation: bounce 0.5s ease;
}

.action-area {
  display: flex;
  justify-content: center;
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
  .game-page {
    padding: 12px;
    padding-top: 12px;
  }

  .question-container {
    padding: 16px;
  }

  .question-text {
    font-size: 32px;
  }

  .question-display {
    padding: 20px;
  }

  .options-grid {
    grid-template-columns: 1fr;
  }

  .option-item {
    padding: 20px;
  }

  .option-content {
    font-size: var(--font-size-large);
  }
}
</style>

