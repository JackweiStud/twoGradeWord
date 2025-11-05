/**
 * 错词本管理器
 * 处理错词的记录、统计、复习
 */

import { storage } from './storage.js'

/**
 * 添加错词
 * @param {Object} word - 错误的词
 * @returns {Object} 更新后的错词本
 */
export const addWrongWord = (word) => {
  const wrongWords = storage.get('WRONG_WORDS') || { words: [], statistics: {} }

  const existingIndex = wrongWords.words.findIndex(
    w => w.char === word.text && w.pinyin === word.pinyin
  )

  if (existingIndex >= 0) {
    // 已存在，增加错误次数
    wrongWords.words[existingIndex].wrongCount++
    wrongWords.words[existingIndex].lastWrongTime = new Date().toISOString()
    wrongWords.words[existingIndex].isMastered = false // 重置掌握状态
    wrongWords.words[existingIndex].correctInReview = 0 // 重置复习计数
  } else {
    // 新增错词
    wrongWords.words.push({
      id: `${word.text}_${word.pinyin}_${Date.now()}`,
      char: word.text,
      pinyin: word.pinyin,
      wrongCount: 1,
      firstWrongTime: new Date().toISOString(),
      lastWrongTime: new Date().toISOString(),
      source: word.source || '未知来源',
      difficulty: word.difficulty || 'simple',
      isMastered: false,
      masteredTime: null,
      correctInReview: 0
    })
  }

  // 更新统计
  updateStatistics(wrongWords)

  // 保存
  storage.set('WRONG_WORDS', wrongWords)
  return wrongWords
}

/**
 * 标记为已掌握
 * @param {String} wordId - 词ID
 * @returns {Boolean}
 */
export const markAsMastered = (wordId) => {
  const wrongWords = storage.get('WRONG_WORDS') || { words: [], statistics: {} }
  const word = wrongWords.words.find(w => w.id === wordId)

  if (word) {
    word.isMastered = true
    word.masteredTime = new Date().toISOString()
    updateStatistics(wrongWords)
    storage.set('WRONG_WORDS', wrongWords)
    return true
  }
  return false
}

/**
 * 记录复习正确
 * @param {String} wordId - 词ID
 * @returns {Boolean} 是否达到掌握标准
 */
export const recordReviewCorrect = (wordId) => {
  const wrongWords = storage.get('WRONG_WORDS') || { words: [], statistics: {} }
  const word = wrongWords.words.find(w => w.id === wordId)

  if (word) {
    word.correctInReview++
    
    // 连续答对3次，自动标记为已掌握
    if (word.correctInReview >= 3) {
      word.isMastered = true
      word.masteredTime = new Date().toISOString()
      updateStatistics(wrongWords)
      storage.set('WRONG_WORDS', wrongWords)
      return true
    }
    
    storage.set('WRONG_WORDS', wrongWords)
  }
  return false
}

/**
 * 记录复习错误
 * @param {String} wordId - 词ID
 */
export const recordReviewWrong = (wordId) => {
  const wrongWords = storage.get('WRONG_WORDS') || { words: [], statistics: {} }
  const word = wrongWords.words.find(w => w.id === wordId)

  if (word) {
    word.correctInReview = 0 // 重置连续正确计数
    word.wrongCount++
    word.lastWrongTime = new Date().toISOString()
    storage.set('WRONG_WORDS', wrongWords)
  }
}

/**
 * 获取错词列表
 * @param {String} filter - 筛选条件 (all/unmastered/mastered)
 * @param {String} sortBy - 排序方式 (wrongCount/time)
 * @returns {Array}
 */
export const getWrongWords = (filter = 'all', sortBy = 'wrongCount') => {
  const wrongWords = storage.get('WRONG_WORDS') || { words: [], statistics: {} }
  let words = [...wrongWords.words]

  // 筛选
  switch (filter) {
    case 'unmastered':
      words = words.filter(w => !w.isMastered)
      break
    case 'mastered':
      words = words.filter(w => w.isMastered)
      break
    default:
      // all - 不筛选
  }

  // 排序
  if (sortBy === 'wrongCount') {
    words.sort((a, b) => b.wrongCount - a.wrongCount)
  } else if (sortBy === 'time') {
    words.sort((a, b) => new Date(b.lastWrongTime) - new Date(a.lastWrongTime))
  }

  return words
}

/**
 * 清除已掌握的错词
 * @returns {Number} 清除的数量
 */
export const clearMastered = () => {
  const wrongWords = storage.get('WRONG_WORDS') || { words: [], statistics: {} }
  const beforeCount = wrongWords.words.length
  wrongWords.words = wrongWords.words.filter(w => !w.isMastered)
  const afterCount = wrongWords.words.length
  
  updateStatistics(wrongWords)
  storage.set('WRONG_WORDS', wrongWords)
  
  return beforeCount - afterCount
}

/**
 * 更新统计数据
 * @param {Object} wrongWords 
 */
const updateStatistics = (wrongWords) => {
  wrongWords.statistics = {
    totalWrongWords: wrongWords.words.length,
    unmasteredCount: wrongWords.words.filter(w => !w.isMastered).length,
    masteredCount: wrongWords.words.filter(w => w.isMastered).length
  }
}

/**
 * 获取错词统计
 * @returns {Object}
 */
export const getStatistics = () => {
  const wrongWords = storage.get('WRONG_WORDS') || { words: [], statistics: {} }
  return wrongWords.statistics || {
    totalWrongWords: 0,
    unmasteredCount: 0,
    masteredCount: 0
  }
}

/**
 * 获取Top错词
 * @param {Number} limit - 数量限制
 * @returns {Array}
 */
export const getTopWrongWords = (limit = 10) => {
  const words = getWrongWords('unmastered', 'wrongCount')
  return words.slice(0, limit)
}

export default {
  addWrongWord,
  markAsMastered,
  recordReviewCorrect,
  recordReviewWrong,
  getWrongWords,
  clearMastered,
  getStatistics,
  getTopWrongWords
}

