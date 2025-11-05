# 🎓 二年级汉字闯关挑战

一个专为小学二年级学生设计的汉字学习游戏，通过趣味闯关的方式帮助孩子掌握汉字知识。

## ✨ 功能特点

### 核心功能
- **🎮 闯关挑战系统**：随机出题，即时反馈，趣味学习
- **📊 三级难度设计**：简单/中等/困难，循序渐进
- **📕 智能错词本**：自动收集错词，支持专项复习
- **🏆 积分奖励系统**：基础分+连对奖励+通关奖励
- **📈 学习统计分析**：正确率、学习时长、趋势图表

### 题目模式
- **模式A**：看拼音选汉字（4选1）
- **模式B**：看汉字选拼音（4选1）
- 双模式随机穿插，增加趣味性

### 难度分级
| 难度 | 题目内容 | 题目数量 | 得分 |
|-----|---------|---------|------|
| 🌱 简单 | 仅单字 | 10题 | 10分/题 |
| 🌿 中等 | 单字+双字词 | 15题 | 15分/题 |
| 🌳 困难 | 单字+双字词+长词组 | 20题 | 20分/题 |

### 学习模式
- **全词库闯关**：从所有词汇中随机抽取
- **错词复习**：专门针对错词本进行练习

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```
访问：http://localhost:3000

### 生产构建
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 📁 项目结构

```
twoGradeWord/
├── src/
│   ├── assets/              # 静态资源
│   │   └── styles/
│   │       └── global.css   # 全局样式
│   ├── components/          # Vue组件
│   │   └── common/          # 通用组件
│   │       ├── AppButton.vue
│   │       ├── AppCard.vue
│   │       └── AppProgress.vue
│   ├── views/               # 页面视图
│   │   ├── Home.vue         # 主页
│   │   ├── DifficultySelect.vue  # 难度选择
│   │   ├── GamePlay.vue     # 游戏页面
│   │   ├── GameResult.vue   # 结算页面
│   │   ├── WrongWords.vue   # 错词本
│   │   ├── Stats.vue        # 学习统计
│   │   └── Settings.vue     # 设置
│   ├── stores/              # Pinia状态管理
│   │   ├── gameStore.js     # 游戏状态
│   │   └── userStore.js     # 用户数据
│   ├── utils/               # 工具函数
│   │   ├── dataParser.js    # 数据解析
│   │   ├── questionGenerator.js  # 题目生成
│   │   ├── scoreCalculator.js    # 得分计算
│   │   ├── wrongWordsManager.js  # 错词管理
│   │   └── storage.js       # 本地存储
│   ├── router/              # 路由配置
│   │   └── index.js
│   ├── App.vue              # 根组件
│   └── main.js              # 入口文件
├── words/                   # 词汇数据
│   ├── wordsSource.json     # 词库（约500+单字）
│   └── readme/
│       └── 汉语闯关挑战游戏策划书.md
├── public/                  # 公共资源
├── index.html               # HTML模板
├── package.json             # 项目配置
├── vite.config.js           # Vite配置
└── README.md                # 本文件
```

## 🎨 技术栈

- **前端框架**：Vue 3（Composition API）
- **构建工具**：Vite
- **路由管理**：Vue Router
- **状态管理**：Pinia
- **样式方案**：Scoped CSS + CSS变量
- **数据存储**：LocalStorage

## 💾 数据存储

应用使用浏览器的LocalStorage存储数据，包括：

- **userProgress**：用户学习进度（总分、正确率、等级等）
- **wrongWords**：错词本数据
- **gameHistory**：游戏历史记录
- **settings**：用户设置

数据示例：
```javascript
{
  "userProgress": {
    "totalScore": 1250,
    "totalQuestions": 150,
    "correctCount": 125,
    "accuracy": 0.833,
    "level": 5,
    "stars": 45
  }
}
```

## 📊 数据流程

```
wordsSource.json (词库)
    ↓
dataParser (解析分类)
    ↓
questionGenerator (生成题目)
    ↓
GamePlay (用户答题)
    ↓
scoreCalculator (计算得分)
    ↓
wrongWordsManager (记录错词)
    ↓
LocalStorage (持久化存储)
```

## 🎯 核心算法

### 1. 题目生成算法
```javascript
// 根据难度筛选词库 → 随机抽取题目 → 生成干扰项 → 打乱选项顺序
generateQuestions(wordPool, difficulty, mode)
```

### 2. 得分计算算法
```javascript
// 基础分 = 单题分 × 答对数
// 连对奖励 = 5连对(+10分) + 10连对(+30分)
// 总分 = 基础分 + 连对奖励 + 通关奖励(50分)
calculateGameScore(gameResult)
```

### 3. 错词掌握判定
```javascript
// 在错词复习模式中，连续答对3次自动标记为"已掌握"
if (correctInReview >= 3) markAsMastered()
```

## 🎮 使用指南

### 开始学习
1. 打开应用，查看学习进度
2. 点击"开始闯关"
3. 选择难度（简单/中等/困难）
4. 选择模式（全词库/错词复习）
5. 开始答题

### 答题技巧
- **模式A**：看拼音选择对应的汉字
- **模式B**：看汉字选择正确的拼音
- 每题有4个选项，点击选择答案
- 答对显示绿色，答错显示红色并提示正确答案
- 连续答对可获得额外奖励

### 查看错词本
1. 点击"错词本"进入
2. 查看所有错误的词汇
3. 可按错误次数或时间排序
4. 点击"开始错词复习"进行专项训练
5. 连续答对3次自动标记为已掌握

### 学习统计
- 总体统计：总题数、正确率、学习时长
- 最近7天：每天的学习情况
- 分难度统计：各难度的表现
- 最易错TOP5：需要重点复习的词汇

## 🎨 UI设计

### 色彩方案（可爱卡通风格）
- **主色**：粉红色 #FF6B9D
- **辅助色**：珊瑚色 #FFA07A
- **成功色**：薄荷绿 #98D8C8
- **警告色**：明黄色 #FFD93D
- **背景色**：奶白色 #FFF5E4

### 设计特点
- 圆角卡片设计
- 柔和渐变效果
- 流畅过渡动画
- 友好的反馈提示

## 📱 响应式设计

应用支持多种屏幕尺寸：
- **桌面端**：完整功能展示
- **平板端**：优化布局
- **移动端**：待优化（建议使用平板或PC）

## 🔧 配置说明

### 修改词库
编辑 `words/wordsSource.json` 文件：
```json
{
  "characters": {
    "recognitionList": [
      {
        "source": "课文1-3",
        "items": [
          { "char": "塘", "pinyin": "táng" },
          { "char": "脑", "pinyin": "nǎo" }
        ]
      }
    ]
  }
}
```

### 调整难度参数
编辑 `src/utils/scoreCalculator.js`：
```javascript
const scoreMap = {
  simple: 10,   // 简单模式单题分数
  medium: 15,   // 中等模式单题分数
  hard: 20      // 困难模式单题分数
}
```

## 🐛 常见问题

### Q: 数据丢失了怎么办？
A: 应用数据存储在浏览器LocalStorage中，清除浏览器缓存会导致数据丢失。建议定期在"设置"页面导出数据备份。

### Q: 如何重置所有数据？
A: 进入"设置"页面，点击"清除所有数据"按钮。

### Q: 词库可以自定义吗？
A: 可以。编辑 `words/wordsSource.json` 文件添加或修改词汇。

### Q: 支持多用户吗？
A: 当前版本仅支持单用户。未来版本将支持多用户功能。

## 📝 开发说明

### 代码风格
- Vue 3 Composition API
- Scoped CSS（遵循组件样式隔离原则）
- ES6+ 语法
- 清晰的注释和命名

### 状态管理
使用Pinia进行状态管理：
- `gameStore`：游戏相关状态（题目、进度、得分）
- `userStore`：用户相关状态（进度、错词、历史）

### 本地存储
使用封装的storage工具进行数据持久化：
```javascript
import { storage } from '@/utils/storage'
storage.set('USER_PROGRESS', data)
const data = storage.get('USER_PROGRESS')
```

## 🚧 未来计划

### 近期计划
- [ ] 添加音效反馈
- [ ] 优化移动端体验
- [ ] 添加学习提醒功能
- [ ] 支持暗黑模式

### 远期计划
- [ ] 多用户支持
- [ ] 云端数据同步
- [ ] 家长监控功能
- [ ] 闯关排行榜
- [ ] 每日任务系统
- [ ] 自定义词库导入

## 📄 许可证

本项目仅供学习使用。

## 👥 贡献

欢迎提出建议和改进意见！

## 📞 联系方式

如有问题或建议，请联系开发者。

---

**🎉 祝学习愉快！**

