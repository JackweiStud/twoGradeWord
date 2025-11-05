/**
 * 得分计算器
 * 处理积分、连对奖励、关卡奖励等
 */

/**
 * 计算单题得分
 * @param {String} difficulty - 难度
 * @param {Boolean} isCorrect - 是否正确
 * @returns {Number}
 */
export const calculateQuestionScore = (difficulty, isCorrect) => {
  if (!isCorrect) return 0

  const scoreMap = {
    simple: 10,
    medium: 15,
    hard: 20
  }
  return scoreMap[difficulty] || 10
}

/**
 * 计算连对奖励
 * @param {Number} comboCount - 连对次数
 * @returns {Number}
 */
export const calculateComboBonus = (comboCount) => {
  if (comboCount >= 10) {
    return 30 // 连对10题奖励30分
  } else if (comboCount >= 5) {
    return 10 // 连对5题奖励10分
  }
  return 0
}

/**
 * 计算关卡总分
 * @param {Object} gameResult - 游戏结果
 * @returns {Object} 得分详情
 */
export const calculateGameScore = (gameResult) => {
  const {
    difficulty,
    correctCount,
    questions,
    maxCombo
  } = gameResult

  // 基础分数
  const baseScore = calculateQuestionScore(difficulty, true) * correctCount

  // 连对奖励（可能有多个）
  let comboBonus = 0
  let currentCombo = 0
  
  questions.forEach(q => {
    if (q.isCorrect) {
      currentCombo++
      if (currentCombo === 5) {
        comboBonus += 10
      } else if (currentCombo === 10) {
        comboBonus += 20 // 10连对额外奖励（总计30）
      }
    } else {
      currentCombo = 0
    }
  })

  // 通关奖励
  const clearBonus = 50

  // 总分
  const totalScore = baseScore + comboBonus + clearBonus

  return {
    baseScore,
    comboBonus,
    clearBonus,
    totalScore,
    breakdown: {
      单题得分: calculateQuestionScore(difficulty, true),
      答对题数: correctCount,
      基础总分: baseScore,
      连对奖励: comboBonus,
      通关奖励: clearBonus
    }
  }
}

/**
 * 计算正确率
 * @param {Number} correctCount - 答对数量
 * @param {Number} totalCount - 总题目数
 * @returns {Number} 正确率 (0-1)
 */
export const calculateAccuracy = (correctCount, totalCount) => {
  if (totalCount === 0) return 0
  return correctCount / totalCount
}

/**
 * 计算星星评级（1-5星）
 * @param {Number} accuracy - 正确率
 * @returns {Number}
 */
export const calculateStars = (accuracy) => {
  if (accuracy >= 0.95) return 5
  if (accuracy >= 0.85) return 4
  if (accuracy >= 0.75) return 3
  if (accuracy >= 0.60) return 2
  return 1
}

/**
 * 更新用户总体数据
 * @param {Object} userProgress - 当前用户数据
 * @param {Object} gameResult - 本次游戏结果
 * @returns {Object} 更新后的用户数据
 */
export const updateUserProgress = (userProgress, gameResult) => {
  const {
    difficulty,
    totalQuestions,
    correctCount,
    wrongCount,
    score,
    duration
  } = gameResult

  // 更新总体数据
  userProgress.totalScore += score
  userProgress.totalQuestions += totalQuestions
  userProgress.correctCount += correctCount
  userProgress.wrongCount += wrongCount
  userProgress.totalStudyTime += duration
  userProgress.lastPlayTime = new Date().toISOString()

  // 重新计算正确率
  userProgress.accuracy = calculateAccuracy(
    userProgress.correctCount,
    userProgress.totalQuestions
  )

  // 更新等级（每500分升1级）
  userProgress.level = Math.floor(userProgress.totalScore / 500) + 1

  // 更新星星数
  userProgress.stars += calculateStars(correctCount / totalQuestions)

  // 更新分难度统计
  const diffStats = userProgress.difficultyStats[difficulty]
  diffStats.totalQuestions += totalQuestions
  diffStats.correctCount += correctCount
  diffStats.accuracy = calculateAccuracy(
    diffStats.correctCount,
    diffStats.totalQuestions
  )

  return userProgress
}

export default {
  calculateQuestionScore,
  calculateComboBonus,
  calculateGameScore,
  calculateAccuracy,
  calculateStars,
  updateUserProgress
}

