/**
 * LocalStorage数据管理
 */
const STORAGE_KEYS = {
  USER_PROGRESS: 'twoGradeWord_userProgress',
  WRONG_WORDS: 'twoGradeWord_wrongWords',
  GAME_HISTORY: 'twoGradeWord_gameHistory',
  SETTINGS: 'twoGradeWord_settings'
}

export const storage = {
  // 获取数据
  get(key) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS[key])
      return data ? JSON.parse(data) : null
    } catch (e) {
      console.error('Storage get error:', e)
      return null
    }
  },

  // 保存数据
  set(key, value) {
    try {
      localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value))
      return true
    } catch (e) {
      console.error('Storage set error:', e)
      return false
    }
  },

  // 删除数据
  remove(key) {
    try {
      localStorage.removeItem(STORAGE_KEYS[key])
      return true
    } catch (e) {
      console.error('Storage remove error:', e)
      return false
    }
  },

  // 清空所有数据
  clear() {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
      return true
    } catch (e) {
      console.error('Storage clear error:', e)
      return false
    }
  },

  // 初始化用户数据
  initUserProgress() {
    const existing = this.get('USER_PROGRESS')
    if (!existing) {
      const initialData = {
        userId: 'default_user',
        userName: '小朋友',
        totalScore: 0,
        totalQuestions: 0,
        correctCount: 0,
        wrongCount: 0,
        accuracy: 0,
        level: 1,
        stars: 0,
        totalStudyTime: 0,
        lastPlayTime: null,
        createdTime: new Date().toISOString(),
        achievements: [],
        difficultyStats: {
          simple: { totalQuestions: 0, correctCount: 0, accuracy: 0 },
          medium: { totalQuestions: 0, correctCount: 0, accuracy: 0 },
          hard: { totalQuestions: 0, correctCount: 0, accuracy: 0 }
        }
      }
      this.set('USER_PROGRESS', initialData)
      return initialData
    }
    return existing
  },

  // 初始化错词本
  initWrongWords() {
    const existing = this.get('WRONG_WORDS')
    if (!existing) {
      const initialData = {
        words: [],
        statistics: {
          totalWrongWords: 0,
          unmasteredCount: 0,
          masteredCount: 0
        }
      }
      this.set('WRONG_WORDS', initialData)
      return initialData
    }
    return existing
  },

  // 初始化游戏历史
  initGameHistory() {
    const existing = this.get('GAME_HISTORY')
    if (!existing) {
      const initialData = {
        history: [],
        statistics: {
          totalGames: 0,
          totalScore: 0,
          averageAccuracy: 0
        }
      }
      this.set('GAME_HISTORY', initialData)
      return initialData
    }
    return existing
  },

  // 初始化设置
  initSettings() {
    const existing = this.get('SETTINGS')
    if (!existing) {
      const initialData = {
        sound: { enabled: true, volume: 0.7 },
        music: { enabled: true, volume: 0.5 },
        animation: { enabled: true, speed: 'normal' },
        display: { theme: 'cute', fontSize: 'medium' },
        game: { autoNextQuestion: false, showPinyinHint: true }
      }
      this.set('SETTINGS', initialData)
      return initialData
    }
    // 兼容旧数据，添加music设置
    if (!existing.music) {
      existing.music = { enabled: true, volume: 0.5 }
      this.set('SETTINGS', existing)
    }
    return existing
  }
}

export default storage

