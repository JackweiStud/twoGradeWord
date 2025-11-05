/**
 * 数据解析器 - 解析wordsSource.json
 * 提取单字、双字词、长词组
 */

/**
 * 解析词库数据
 * @param {Object} data - wordsSource.json数据
 * @returns {Object} 解析后的数据 { characters, shortPhrases, longPhrases }
 */
export const parseWordsSource = (data) => {
  const characters = []
  const shortPhrases = []
  const longPhrases = []

  try {
    // 解析单字数据
    if (data.characters && data.characters.recognitionList) {
      data.characters.recognitionList.forEach(group => {
        const source = group.source || '未知来源'
        
        group.items.forEach(item => {
          if (item.char) {
            const wordData = {
              text: item.char,
              pinyin: item.pinyin || '',
              source: source,
              type: 'char'
            }

            // 根据字符长度分类
            if (item.char.length === 1) {
              characters.push(wordData)
            } else if (item.char.length === 2) {
              wordData.type = 'short_phrase'
              shortPhrases.push(wordData)
            } else {
              wordData.type = 'long_phrase'
              longPhrases.push(wordData)
            }
          }

          // 处理词组数据（如果有phrase字段）
          if (item.phrase) {
            const phraseData = {
              text: item.phrase,
              pinyin: item.pinyin || '',
              source: item.ref || source,
              type: item.phrase.length <= 2 ? 'short_phrase' : 'long_phrase'
            }

            if (item.phrase.length <= 2) {
              shortPhrases.push(phraseData)
            } else {
              longPhrases.push(phraseData)
            }
          }
        })
      })
    }

    console.log('数据解析完成：', {
      单字数量: characters.length,
      双字词数量: shortPhrases.length,
      长词组数量: longPhrases.length
    })

    return {
      characters,
      shortPhrases,
      longPhrases,
      total: characters.length + shortPhrases.length + longPhrases.length
    }
  } catch (error) {
    console.error('数据解析失败：', error)
    return {
      characters: [],
      shortPhrases: [],
      longPhrases: [],
      total: 0
    }
  }
}

/**
 * 根据难度筛选词库
 * @param {Object} parsedData - 解析后的数据
 * @param {String} difficulty - 难度 (simple/medium/hard)
 * @returns {Array} 筛选后的词库
 */
export const filterByDifficulty = (parsedData, difficulty) => {
  const { characters, shortPhrases, longPhrases } = parsedData

  switch (difficulty) {
    case 'simple':
      return characters
    case 'medium':
      return [...characters, ...shortPhrases]
    case 'hard':
      return [...characters, ...shortPhrases, ...longPhrases]
    default:
      return characters
  }
}

/**
 * 根据来源筛选词库
 * @param {Array} words - 词库数组
 * @param {String} source - 来源（如"课文1-3"）
 * @returns {Array} 筛选后的词库
 */
export const filterBySource = (words, source) => {
  if (!source || source === 'all') {
    return words
  }
  return words.filter(word => word.source.includes(source))
}

/**
 * 获取所有来源列表
 * @param {Array} words - 词库数组
 * @returns {Array} 来源列表
 */
export const getSourceList = (words) => {
  const sources = new Set()
  words.forEach(word => {
    if (word.source) {
      sources.add(word.source)
    }
  })
  return Array.from(sources)
}

export default {
  parseWordsSource,
  filterByDifficulty,
  filterBySource,
  getSourceList
}

