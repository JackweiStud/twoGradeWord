/**
 * 游戏状态管理
 */
import { defineStore } from 'pinia'
import { storage } from '@/utils/storage'
import { parseWordsSource, filterByDifficulty } from '@/utils/dataParser'
import { generateQuestions, checkAnswer } from '@/utils/questionGenerator'
import { calculateGameScore } from '@/utils/scoreCalculator'
import { addWrongWord } from '@/utils/wrongWordsManager'

export const useGameStore = defineStore('game', {
  state: () => ({
    // 词库数据
    wordsData: null,
    parsedData: null,
    
    // 当前游戏配置
    currentDifficulty: 'simple', // simple/medium/hard
    currentMode: 'all', // all/unit/wrong
    currentQuestionType: 'C', // A/B/C (A:看拼音选汉字, B:看汉字选拼音, C:混合)
    
    // 题目数据
    questions: [],
    currentQuestionIndex: 0,
    
    // 游戏状态
    gameStarted: false,
    gameFinished: false,
    startTime: null,
    
    // 答题统计
    correctCount: 0,
    wrongCount: 0,
    currentCombo: 0,
    maxCombo: 0,
    
    // 游戏结果
    gameResult: null
  }),

  getters: {
    // 当前题目
    currentQuestion: (state) => {
      return state.questions[state.currentQuestionIndex]
    },
    
    // 总题目数
    totalQuestions: (state) => state.questions.length,
    
    // 进度百分比
    progress: (state) => {
      if (state.questions.length === 0) return 0
      return Math.round((state.currentQuestionIndex / state.questions.length) * 100)
    },
    
    // 是否是最后一题
    isLastQuestion: (state) => {
      return state.currentQuestionIndex === state.questions.length - 1
    },
    
    // 正确率
    accuracy: (state) => {
      const total = state.correctCount + state.wrongCount
      if (total === 0) return 0
      return state.correctCount / total
    }
  },

  actions: {
    // 加载词库数据
    async loadWordsData() {
      try {
        const response = await fetch('/words/wordsSource.json')
        const data = await response.json()
        this.wordsData = data
        this.parsedData = parseWordsSource(data)
        console.log('词库加载成功', this.parsedData)
        return true
      } catch (error) {
        console.error('词库加载失败', error)
        return false
      }
    },

    // 开始新游戏
    startNewGame(difficulty, mode = 'all', questionType = 'C') {
      if (!this.parsedData) {
        console.error('词库未加载')
        return false
      }

      this.currentDifficulty = difficulty
      this.currentMode = mode
      this.currentQuestionType = questionType
      
      // 根据难度筛选词库
      let wordPool = filterByDifficulty(this.parsedData, difficulty)
      
      // 如果是错词模式，从错词本中获取
      if (mode === 'wrong') {
        const wrongWords = storage.get('WRONG_WORDS')
        if (wrongWords && wrongWords.words.length > 0) {
          wordPool = wrongWords.words
            .filter(w => !w.isMastered)
            .map(w => ({
              text: w.char,
              pinyin: w.pinyin,
              source: w.source
            }))
        } else {
          console.warn('错词本为空，切换到全词库模式')
          wordPool = filterByDifficulty(this.parsedData, difficulty)
        }
      }

      // 生成题目（传入答题类型）
      this.questions = generateQuestions(wordPool, difficulty, mode, questionType)
      
      // 重置游戏状态
      this.currentQuestionIndex = 0
      this.correctCount = 0
      this.wrongCount = 0
      this.currentCombo = 0
      this.maxCombo = 0
      this.gameStarted = true
      this.gameFinished = false
      this.startTime = Date.now()
      this.gameResult = null

      console.log(`游戏开始：难度${difficulty}，模式${mode}，题目数${this.questions.length}`)
      return true
    },

    // 提交答案
    submitAnswer(answer) {
      const question = this.currentQuestion
      if (!question || question.answered) {
        return false
      }

      // 检查答案
      const isCorrect = checkAnswer(question, answer)
      
      // 更新题目状态
      question.answered = true
      question.isCorrect = isCorrect
      question.userAnswer = answer
      question.spentTime = Date.now() - (this.startTime + this.currentQuestionIndex * 1000)

      // 更新统计
      if (isCorrect) {
        this.correctCount++
        this.currentCombo++
        if (this.currentCombo > this.maxCombo) {
          this.maxCombo = this.currentCombo
        }
      } else {
        this.wrongCount++
        this.currentCombo = 0
        
        // 记录到错词本
        addWrongWord({
          text: question.correct.text,
          pinyin: question.correct.pinyin,
          source: question.correct.source,
          difficulty: this.currentDifficulty
        })
      }

      return isCorrect
    },

    // 下一题
    nextQuestion() {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++
        return true
      } else {
        // 游戏结束
        this.finishGame()
        return false
      }
    },

    // 结束游戏
    finishGame() {
      this.gameFinished = true
      const duration = Math.floor((Date.now() - this.startTime) / 1000)

      // 计算得分
      const scoreResult = calculateGameScore({
        difficulty: this.currentDifficulty,
        correctCount: this.correctCount,
        questions: this.questions,
        maxCombo: this.maxCombo
      })

      this.gameResult = {
        difficulty: this.currentDifficulty,
        mode: this.currentMode,
        totalQuestions: this.questions.length,
        correctCount: this.correctCount,
        wrongCount: this.wrongCount,
        accuracy: this.accuracy,
        maxCombo: this.maxCombo,
        duration: duration,
        score: scoreResult.totalScore,
        scoreBreakdown: scoreResult,
        questions: this.questions,
        finishTime: new Date().toISOString()
      }

      // 保存游戏历史
      this.saveGameHistory()

      // 更新用户进度
      this.updateUserProgress()

      console.log('游戏结束', this.gameResult)
    },

    // 保存游戏历史
    saveGameHistory() {
      const history = storage.get('GAME_HISTORY') || { history: [], statistics: {} }
      
      history.history.unshift({
        id: `game_${Date.now()}`,
        date: new Date().toLocaleDateString('zh-CN'),
        datetime: this.gameResult.finishTime,
        ...this.gameResult
      })

      // 只保留最近50条记录
      if (history.history.length > 50) {
        history.history = history.history.slice(0, 50)
      }

      // 更新统计
      history.statistics = {
        totalGames: history.history.length,
        totalScore: history.history.reduce((sum, g) => sum + g.score, 0),
        averageAccuracy: history.history.reduce((sum, g) => sum + g.accuracy, 0) / history.history.length
      }

      storage.set('GAME_HISTORY', history)
    },

    // 更新用户进度
    updateUserProgress() {
      const userProgress = storage.get('USER_PROGRESS') || storage.initUserProgress()
      
      // 更新总体数据
      userProgress.totalScore += this.gameResult.score
      userProgress.totalQuestions += this.gameResult.totalQuestions
      userProgress.correctCount += this.gameResult.correctCount
      userProgress.wrongCount += this.gameResult.wrongCount
      userProgress.totalStudyTime += this.gameResult.duration
      userProgress.lastPlayTime = this.gameResult.finishTime

      // 重新计算正确率
      userProgress.accuracy = userProgress.correctCount / userProgress.totalQuestions

      // 更新等级
      userProgress.level = Math.floor(userProgress.totalScore / 500) + 1

      // 更新星星数
      const stars = this.gameResult.accuracy >= 0.95 ? 5 :
                    this.gameResult.accuracy >= 0.85 ? 4 :
                    this.gameResult.accuracy >= 0.75 ? 3 :
                    this.gameResult.accuracy >= 0.60 ? 2 : 1
      userProgress.stars += stars

      // 更新分难度统计
      const diffStats = userProgress.difficultyStats[this.currentDifficulty]
      diffStats.totalQuestions += this.gameResult.totalQuestions
      diffStats.correctCount += this.gameResult.correctCount
      diffStats.accuracy = diffStats.correctCount / diffStats.totalQuestions

      storage.set('USER_PROGRESS', userProgress)
    },

    // 重置游戏
    resetGame() {
      this.questions = []
      this.currentQuestionIndex = 0
      this.correctCount = 0
      this.wrongCount = 0
      this.currentCombo = 0
      this.maxCombo = 0
      this.gameStarted = false
      this.gameFinished = false
      this.startTime = null
      this.gameResult = null
    }
  }
})

