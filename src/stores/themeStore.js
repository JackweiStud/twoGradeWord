/**
 * 主题状态管理
 * 支持5套主题：湖蓝清新、粉红可爱、深色护眼、春日温柔、黑色银河
 */
import { defineStore } from 'pinia'
import { storage } from '@/utils/storage'

// 主题定义
export const themes = {
  // 1. 湖蓝清新主题（默认）- 现代Flat 2.0风格
  lake_blue: {
    id: 'lake_blue',
    name: '湖蓝清新',
    icon: '🌊',
    description: '现代简约，清新舒适',
    colors: {
      // 主色调
      primary: '#3498DB',
      primaryHover: '#2980B9',
      primaryLight: '#5DADE2',
      secondary: '#FFA500',
      secondaryHover: '#FF8C00',
      
      // 语义色
      success: '#2ECC71',
      warning: '#F39C12',
      error: '#E74C3C',
      info: '#1ABC9C',
      
      // 背景色
      bgPrimary: '#F7F8FA',
      bgSecondary: '#FFFFFF',
      bgCard: '#FFFFFF',
      bgHover: '#F0F2F5',
      
      // 文字色
      textPrimary: '#333333',
      textSecondary: '#666666',
      textLight: '#999999',
      textInverse: '#FFFFFF',
      
      // 边框色
      border: '#E0E0E0',
      borderLight: '#F0F0F0',
      
      // 阴影
      shadowLight: '0 2px 8px rgba(52, 152, 219, 0.08)',
      shadowMedium: '0 4px 16px rgba(52, 152, 219, 0.12)',
      shadowHeavy: '0 8px 24px rgba(52, 152, 219, 0.16)',
      
      // 圆角
      radiusSmall: '8px',
      radiusMedium: '12px',
      radiusLarge: '16px',
      radiusRound: '50%',
      
      // 答题界面专用渐变色
      gradientQuestion: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
      gradientSelected: 'linear-gradient(135deg, #FFF5E4 0%, #FFE8D6 100%)',
      gradientCorrect: 'linear-gradient(135deg, #E8F8F5 0%, #D5F5E8 100%)',
      gradientWrong: 'linear-gradient(135deg, #FFE8E8 0%, #FFD5D5 100%)',
      gradientCombo: 'linear-gradient(135deg, #FFD93D 0%, #FFE16D 100%)',
      gradientScoreText: 'linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%)',
      comboTextColor: '#333333',
    }
  },
  
  // 2. 粉红可爱主题（原风格）
  pink_cute: {
    id: 'pink_cute',
    name: '粉红可爱',
    icon: '🎀',
    description: '甜美可爱，温馨浪漫',
    colors: {
      primary: '#FF6B9D',
      primaryHover: '#FF5589',
      primaryLight: '#FFB3C6',
      secondary: '#FFA07A',
      secondaryHover: '#FF8C66',
      
      success: '#98D8C8',
      warning: '#FFD93D',
      error: '#FF6B6B',
      info: '#6BCF7F',
      
      bgPrimary: '#FFF5E4',
      bgSecondary: '#FFF9F0',
      bgCard: '#FFFFFF',
      bgHover: '#FFEFE0',
      
      textPrimary: '#333333',
      textSecondary: '#666666',
      textLight: '#999999',
      textInverse: '#FFFFFF',
      
      border: '#FFE0E6',
      borderLight: '#FFF0F3',
      
      shadowLight: '0 2px 8px rgba(255, 107, 157, 0.08)',
      shadowMedium: '0 4px 16px rgba(255, 107, 157, 0.12)',
      shadowHeavy: '0 8px 24px rgba(255, 107, 157, 0.16)',
      
      radiusSmall: '8px',
      radiusMedium: '12px',
      radiusLarge: '16px',
      radiusRound: '50%',
      
      // 答题界面专用渐变色
      gradientQuestion: 'linear-gradient(135deg, #FFF0F5 0%, #FFE0F0 100%)',
      gradientSelected: 'linear-gradient(135deg, #FFE0F0 0%, #FFD0E8 100%)',
      gradientCorrect: 'linear-gradient(135deg, #E0F8F0 0%, #D0F5E8 100%)',
      gradientWrong: 'linear-gradient(135deg, #FFE0E8 0%, #FFD0DD 100%)',
      gradientCombo: 'linear-gradient(135deg, #FFE8A3 0%, #FFF0B8 100%)',
      gradientScoreText: 'linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%)',
      comboTextColor: '#663366',
    }
  },
  
  // 3. 深色护眼主题
  dark_eye: {
    id: 'dark_eye',
    name: '深色护眼',
    icon: '🌙',
    description: '保护视力，沉浸专注',
    colors: {
      primary: '#4A90E2',
      primaryHover: '#5BA3F5',
      primaryLight: '#6BB3FF',
      secondary: '#FFA500',
      secondaryHover: '#FFB520',
      
      success: '#52C41A',
      warning: '#FAAD14',
      error: '#F5222D',
      info: '#13C2C2',
      
      bgPrimary: '#1E1E1E',
      bgSecondary: '#252525',
      bgCard: '#2D2D2D',
      bgHover: '#363636',
      
      textPrimary: '#E0E0E0',
      textSecondary: '#B0B0B0',
      textLight: '#808080',
      textInverse: '#1E1E1E',
      
      border: '#404040',
      borderLight: '#353535',
      
      shadowLight: '0 2px 8px rgba(0, 0, 0, 0.3)',
      shadowMedium: '0 4px 16px rgba(0, 0, 0, 0.4)',
      shadowHeavy: '0 8px 24px rgba(0, 0, 0, 0.5)',
      
      radiusSmall: '6px',
      radiusMedium: '10px',
      radiusLarge: '12px',
      radiusRound: '50%',
      
      // 答题界面专用渐变色（深色主题）
      gradientQuestion: 'linear-gradient(135deg, #2A3A4A 0%, #35455A 100%)',
      gradientSelected: 'linear-gradient(135deg, #3A4A5A 0%, #455A6A 100%)',
      gradientCorrect: 'linear-gradient(135deg, #2A4A3A 0%, #356A45 100%)',
      gradientWrong: 'linear-gradient(135deg, #4A2A2A 0%, #6A3535 100%)',
      gradientCombo: 'linear-gradient(135deg, #5A4A2A 0%, #7A6A3A 100%)',
      gradientScoreText: 'linear-gradient(135deg, #5BA3F5 0%, #FFB520 100%)',
      comboTextColor: '#FFE16D',
    }
  },
  
  // 4. 春日温柔主题
  spring_soft: {
    id: 'spring_soft',
    name: '春日温柔',
    icon: '🌸',
    description: '温柔优雅，春意盎然',
    colors: {
      primary: '#E8B4B8',
      primaryHover: '#D49BA0',
      primaryLight: '#F5D4D7',
      secondary: '#F4D6B0',
      secondaryHover: '#E8C89A',
      
      success: '#B8D8BA',
      warning: '#F4D6B0',
      error: '#E8B4B8',
      info: '#B4D8E8',
      
      bgPrimary: '#FFF8F0',
      bgSecondary: '#FFFBF5',
      bgCard: '#FFFFFF',
      bgHover: '#FFF0E5',
      
      textPrimary: '#5D4037',
      textSecondary: '#8D6E63',
      textLight: '#A1887F',
      textInverse: '#FFFFFF',
      
      border: '#F5E6E8',
      borderLight: '#FAF0F2',
      
      shadowLight: '0 2px 8px rgba(232, 180, 184, 0.08)',
      shadowMedium: '0 4px 16px rgba(232, 180, 184, 0.12)',
      shadowHeavy: '0 8px 24px rgba(232, 180, 184, 0.16)',
      
      radiusSmall: '10px',
      radiusMedium: '16px',
      radiusLarge: '20px',
      radiusRound: '50%',
      
      // 答题界面专用渐变色
      gradientQuestion: 'linear-gradient(135deg, #FAF0E6 0%, #F5E6D3 100%)',
      gradientSelected: 'linear-gradient(135deg, #F5E6D3 0%, #F0DCC8 100%)',
      gradientCorrect: 'linear-gradient(135deg, #E6F5E8 0%, #D8F0DC 100%)',
      gradientWrong: 'linear-gradient(135deg, #F5E6E6 0%, #F0D8D8 100%)',
      gradientCombo: 'linear-gradient(135deg, #F5E8C8 0%, #F0E0B8 100%)',
      gradientScoreText: 'linear-gradient(135deg, #E8B4B8 0%, #F4D6B0 100%)',
      comboTextColor: '#5D4037',
    }
  },
  
  // 5. 黑色银河主题
  galaxy_black: {
    id: 'galaxy_black',
    name: '黑色银河',
    icon: '✨',
    description: '星空浩瀚，科技未来',
    colors: {
      primary: '#8B5CF6',
      primaryHover: '#A78BFA',
      primaryLight: '#C4B5FD',
      secondary: '#06B6D4',
      secondaryHover: '#22D3EE',
      
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
      
      bgPrimary: '#0A0A0F',
      bgSecondary: '#121218',
      bgCard: '#1A1A24',
      bgHover: '#232330',
      
      textPrimary: '#E7E7EA',
      textSecondary: '#B4B4BC',
      textLight: '#808089',
      textInverse: '#0A0A0F',
      
      border: '#2A2A38',
      borderLight: '#1F1F2A',
      
      shadowLight: '0 2px 8px rgba(139, 92, 246, 0.15)',
      shadowMedium: '0 4px 16px rgba(139, 92, 246, 0.25)',
      shadowHeavy: '0 8px 24px rgba(139, 92, 246, 0.35)',
      
      radiusSmall: '8px',
      radiusMedium: '12px',
      radiusLarge: '16px',
      radiusRound: '50%',
      
      // 答题界面专用渐变色（深色主题）
      gradientQuestion: 'linear-gradient(135deg, #2A2A3F 0%, #35354F 100%)',
      gradientSelected: 'linear-gradient(135deg, #3A3A50 0%, #454560 100%)',
      gradientCorrect: 'linear-gradient(135deg, #2A3F3A 0%, #356A45 100%)',
      gradientWrong: 'linear-gradient(135deg, #3F2A2A 0%, #603535 100%)',
      gradientCombo: 'linear-gradient(135deg, #4A3F5F 0%, #6A5A8F 100%)',
      gradientScoreText: 'linear-gradient(135deg, #A78BFA 0%, #22D3EE 100%)',
      comboTextColor: '#C4B5FD',
    }
  }
}

export const useThemeStore = defineStore('theme', {
  state: () => ({
    currentThemeId: 'lake_blue', // 默认湖蓝清新主题
  }),

  getters: {
    // 当前主题对象
    currentTheme: (state) => {
      return themes[state.currentThemeId] || themes.lake_blue
    },
    
    // 当前主题颜色
    colors: (state) => {
      const theme = themes[state.currentThemeId] || themes.lake_blue
      return theme.colors
    },
    
    // 所有主题列表
    allThemes: () => {
      return Object.values(themes)
    }
  },

  actions: {
    // 初始化主题（从存储中加载）
    initTheme() {
      const savedThemeId = storage.get('THEME_ID')
      if (savedThemeId && themes[savedThemeId]) {
        this.currentThemeId = savedThemeId
      }
      this.applyTheme()
      console.log('主题初始化完成：', this.currentTheme.name)
    },

    // 切换主题
    switchTheme(themeId) {
      if (!themes[themeId]) {
        console.error('主题不存在：', themeId)
        return false
      }
      
      this.currentThemeId = themeId
      this.applyTheme()
      storage.set('THEME_ID', themeId)
      console.log('切换主题成功：', this.currentTheme.name)
      return true
    },

    // 应用主题到DOM
    applyTheme() {
      const colors = this.colors
      const root = document.documentElement
      
      // 遍历所有颜色变量，注入到CSS变量
      Object.entries(colors).forEach(([key, value]) => {
        // 将驼峰命名转换为kebab-case
        const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
        root.style.setProperty(cssVarName, value)
      })
      
      // 设置主题标识
      root.setAttribute('data-theme', this.currentThemeId)
    },

    // 获取指定主题的颜色
    getThemeColors(themeId) {
      const theme = themes[themeId]
      return theme ? theme.colors : null
    }
  }
})
