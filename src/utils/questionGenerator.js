/**
 * 题目生成器
 * 根据难度和模式生成题目
 */

/**
 * 生成题目
 * @param {Array} wordPool - 词库池
 * @param {String} difficulty - 难度 (simple/medium/hard)
 * @param {String} mode - 模式 (all/unit/wrong)
 * @returns {Array} 题目数组
 */
export const generateQuestions = (wordPool, difficulty, mode = 'all') => {
  if (!wordPool || wordPool.length === 0) {
    console.error('词库为空，无法生成题目')
    return []
  }

  // 根据难度确定题目数量
  const questionCount = getQuestionCount(difficulty)
  
  // 如果词库不足，调整题目数量
  const actualCount = Math.min(questionCount, wordPool.length)
  
  const questions = []
  const usedIndices = new Set()

  for (let i = 0; i < actualCount; i++) {
    // 随机选择一个未使用的词
    let randomIndex
    do {
      randomIndex = Math.floor(Math.random() * wordPool.length)
    } while (usedIndices.has(randomIndex))
    
    usedIndices.add(randomIndex)
    const correctWord = wordPool[randomIndex]

    // 随机选择题目模式（模式A或模式B）
    const questionMode = Math.random() > 0.5 ? 'A' : 'B'

    // 生成干扰项
    const distractors = generateDistractors(correctWord, wordPool, questionMode, usedIndices)

    // 生成选项并打乱顺序
    const options = shuffleArray([
      { ...correctWord, isCorrect: true },
      ...distractors
    ])

    questions.push({
      id: `q_${Date.now()}_${i}`,
      mode: questionMode, // A: 看拼音选汉字, B: 看汉字选拼音
      correct: correctWord,
      options: options,
      answered: false,
      isCorrect: null,
      userAnswer: null,
      spentTime: 0
    })
  }

  return questions
}

/**
 * 根据难度获取题目数量
 * @param {String} difficulty 
 * @returns {Number}
 */
const getQuestionCount = (difficulty) => {
  const countMap = {
    simple: 10,
    medium: 15,
    hard: 20
  }
  return countMap[difficulty] || 10
}

/**
 * 生成干扰项
 * @param {Object} correct - 正确答案
 * @param {Array} pool - 词库池
 * @param {String} mode - 题目模式
 * @param {Set} usedIndices - 已使用的索引
 * @returns {Array} 干扰项数组
 */
const generateDistractors = (correct, pool, mode, usedIndices = new Set()) => {
  const distractors = []
  const used = new Set([correct.text])
  const maxAttempts = pool.length * 2 // 防止死循环

  let attempts = 0
  while (distractors.length < 3 && attempts < maxAttempts) {
    attempts++
    const randomIndex = Math.floor(Math.random() * pool.length)
    const candidate = pool[randomIndex]

    // 确保不重复且不是正确答案
    if (!used.has(candidate.text) && candidate.text !== correct.text) {
      distractors.push({
        ...candidate,
        isCorrect: false
      })
      used.add(candidate.text)
    }
  }

  // 如果干扰项不足3个，用随机拼音/汉字填充
  while (distractors.length < 3) {
    const fakeOption = mode === 'A' 
      ? { text: `字${distractors.length}`, pinyin: correct.pinyin, isCorrect: false }
      : { text: correct.text, pinyin: `pin${distractors.length}`, isCorrect: false }
    distractors.push(fakeOption)
  }

  return distractors
}

/**
 * 数组乱序（Fisher-Yates洗牌算法）
 * @param {Array} array 
 * @returns {Array}
 */
const shuffleArray = (array) => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

/**
 * 验证答案
 * @param {Object} question - 题目对象
 * @param {Object} userAnswer - 用户答案
 * @returns {Boolean}
 */
export const checkAnswer = (question, userAnswer) => {
  if (!question || !userAnswer) return false
  
  if (question.mode === 'A') {
    // 模式A：看拼音选汉字，比较汉字
    return userAnswer.text === question.correct.text
  } else {
    // 模式B：看汉字选拼音，比较拼音
    return userAnswer.pinyin === question.correct.pinyin
  }
}

export default {
  generateQuestions,
  checkAnswer
}

