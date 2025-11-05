/**
 * 用户数据状态管理
 */
import { defineStore } from 'pinia'
import { storage } from '@/utils/storage'

export const useUserStore = defineStore('user', {
  state: () => ({
    userProgress: null,
    wrongWords: null,
    gameHistory: null,
    settings: null
  }),

  getters: {
    // 总分
    totalScore: (state) => state.userProgress?.totalScore || 0,
    
    // 等级
    level: (state) => state.userProgress?.level || 1,
    
    // 星星数
    stars: (state) => state.userProgress?.stars || 0,
    
    // 正确率
    accuracy: (state) => state.userProgress?.accuracy || 0,
    
    // 掌握词汇数
    masteredWordsCount: (state) => {
      if (!state.userProgress) return 0
      const { simple, medium, hard } = state.userProgress.difficultyStats
      return simple.correctCount + medium.correctCount + hard.correctCount
    },
    
    // 错词统计
    wrongWordsStats: (state) => state.wrongWords?.statistics || {
      totalWrongWords: 0,
      unmasteredCount: 0,
      masteredCount: 0
    },
    
    // 最近7天游戏记录
    recentGames: (state) => {
      if (!state.gameHistory || !state.gameHistory.history) return []
      return state.gameHistory.history.slice(0, 7)
    }
  },

  actions: {
    // 初始化用户数据
    initUserData() {
      this.userProgress = storage.initUserProgress()
      this.wrongWords = storage.initWrongWords()
      this.gameHistory = storage.initGameHistory()
      this.settings = storage.initSettings()
      console.log('用户数据初始化完成')
    },

    // 加载用户数据
    loadUserData() {
      this.userProgress = storage.get('USER_PROGRESS') || storage.initUserProgress()
      this.wrongWords = storage.get('WRONG_WORDS') || storage.initWrongWords()
      this.gameHistory = storage.get('GAME_HISTORY') || storage.initGameHistory()
      this.settings = storage.get('SETTINGS') || storage.initSettings()
      console.log('用户数据加载完成', this.userProgress)
    },

    // 刷新用户数据
    refreshUserData() {
      this.loadUserData()
    },

    // 更新设置
    updateSettings(newSettings) {
      this.settings = { ...this.settings, ...newSettings }
      storage.set('SETTINGS', this.settings)
    },

    // 清除所有数据
    clearAllData() {
      if (confirm('确定要清除所有学习数据吗？此操作不可恢复！')) {
        storage.clear()
        this.initUserData()
        return true
      }
      return false
    },

    // 导出数据
    exportData() {
      const data = {
        userProgress: this.userProgress,
        wrongWords: this.wrongWords,
        gameHistory: this.gameHistory,
        settings: this.settings,
        exportTime: new Date().toISOString()
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `学习数据_${new Date().toLocaleDateString('zh-CN')}.json`
      a.click()
      URL.revokeObjectURL(url)
    }
  }
})

