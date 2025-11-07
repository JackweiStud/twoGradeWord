/**
 * 音效管理器
 * 使用 Web Audio API 生成音效，无需外部音频文件
 */
import { storage } from './storage'

class SoundManager {
  constructor() {
    this.audioContext = null
    this.soundEnabled = true
    this.soundVolume = 0.7
    this.musicEnabled = true
    this.musicVolume = 0.5
    this.currentMusic = null
    this.musicTimer = null
    this.musicType = null
    this.initAudioContext()
    this.loadSettings()
  }

  // 初始化音频上下文
  initAudioContext() {
    try {
      // 兼容不同浏览器的 AudioContext
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      if (AudioContextClass) {
        this.audioContext = new AudioContextClass()
      }
    } catch (e) {
      console.warn('音频上下文初始化失败:', e)
    }
  }

  // 加载设置
  loadSettings() {
    const settings = storage.get('SETTINGS')
    if (settings) {
      this.soundEnabled = settings.sound?.enabled !== false
      this.soundVolume = settings.sound?.volume ?? 0.7
      this.musicEnabled = settings.music?.enabled !== false
      this.musicVolume = settings.music?.volume ?? 0.5
    }
  }

  // 更新设置
  updateSettings(settings) {
    if (settings.sound !== undefined) {
      this.soundEnabled = settings.sound.enabled !== false
      this.soundVolume = settings.sound.volume ?? 0.7
    }
    if (settings.music !== undefined) {
      this.musicEnabled = settings.music.enabled !== false
      this.musicVolume = settings.music.volume ?? 0.5
      // 如果关闭音乐，停止当前播放
      if (!this.musicEnabled && this.currentMusic) {
        this.stopMusic()
      }
    }
  }

  // 确保音频上下文已激活（浏览器需要用户交互后才能播放）
  ensureAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
  }

  /**
   * 生成音调
   * @param {Number} frequency - 频率（Hz）
   * @param {Number} duration - 持续时间（秒）
   * @param {String} type - 波形类型（sine/square/sawtooth/triangle）
   * @param {Number} volume - 音量（0-1）
   */
  playTone(frequency, duration = 0.2, type = 'sine', volume = 0.3) {
    if (!this.soundEnabled || !this.audioContext) return

    this.ensureAudioContext()

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.frequency.value = frequency
      oscillator.type = type

      // 音量包络（淡入淡出）
      const now = this.audioContext.currentTime
      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(volume * this.soundVolume, now + 0.01)
      gainNode.gain.linearRampToValueAtTime(0, now + duration)

      oscillator.start(now)
      oscillator.stop(now + duration)
    } catch (e) {
      console.warn('音效播放失败:', e)
    }
  }

  /**
   * 播放和弦（多个音调同时播放）
   */
  playChord(frequencies, duration = 0.3, volume = 0.2) {
    if (!this.soundEnabled || !this.audioContext) return

    this.ensureAudioContext()

    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.playTone(freq, duration, 'sine', volume)
      }, index * 20)
    })
  }

  /**
   * 答对音效 - 清脆的上升音调
   */
  playCorrect() {
    if (!this.soundEnabled) return
    
    // 播放上升音调序列
    const frequencies = [523.25, 659.25, 783.99] // C5, E5, G5
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.playTone(freq, 0.15, 'sine', 0.25)
      }, index * 100)
    })
  }

  /**
   * 答错音效 - 低沉的下降音调
   */
  playWrong() {
    if (!this.soundEnabled) return
    
    // 播放下降音调
    const frequencies = [392, 330, 262] // G4, E4, C4
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.playTone(freq, 0.2, 'sawtooth', 0.2)
      }, index * 80)
    })
  }

  /**
   * 连对音效 - 特殊的连击音效
   */
  playCombo(count) {
    if (!this.soundEnabled) return
    
    if (count >= 10) {
      // 10连对：播放庆祝和弦
      this.playChord([523.25, 659.25, 783.99, 1046.5], 0.4, 0.3)
    } else if (count >= 5) {
      // 5连对：播放上升音阶
      const frequencies = [440, 523.25, 659.25, 783.99] // A4, C5, E5, G5
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          this.playTone(freq, 0.2, 'sine', 0.25)
        }, index * 100)
      })
    } else if (count >= 3) {
      // 3连对：播放简单音调
      this.playTone(659.25, 0.2, 'sine', 0.2) // E5
    }
  }

  /**
   * 通关音效 - 庆祝音效
   */
  playVictory() {
    if (!this.soundEnabled) return
    
    // 播放胜利和弦序列
    const chords = [
      [523.25, 659.25, 783.99], // C major
      [587.33, 698.46, 880],    // D major
      [659.25, 783.99, 987.77], // E major
      [523.25, 659.25, 783.99]  // C major
    ]
    
    chords.forEach((chord, index) => {
      setTimeout(() => {
        this.playChord(chord, 0.3, 0.25)
      }, index * 200)
    })
  }

  /**
   * 完美通关音效 - 特殊庆祝
   */
  playPerfect() {
    if (!this.soundEnabled) return
    
    // 播放更华丽的音效
    const sequence = [
      { freq: 523.25, delay: 0 },
      { freq: 659.25, delay: 100 },
      { freq: 783.99, delay: 200 },
      { freq: 1046.5, delay: 300 },
      { freq: 1318.5, delay: 400 }
    ]
    
    sequence.forEach(({ freq, delay }) => {
      setTimeout(() => {
        this.playTone(freq, 0.25, 'sine', 0.3)
      }, delay)
    })
  }

  /**
   * 按钮点击音效
   */
  playClick() {
    if (!this.soundEnabled) return
    this.playTone(800, 0.05, 'sine', 0.15)
  }

  /**
   * 页面切换音效
   */
  playPageTransition() {
    if (!this.soundEnabled) return
    this.playTone(600, 0.1, 'sine', 0.1)
  }

  /**
   * 播放背景音乐（使用Web Audio API生成简单的背景音乐）
   */
  playBackgroundMusic(type = 'home') {
    // 检查全局变量，优先级高于设置
    if (window.BACKGROUND_MUSIC_ENABLED === false) return
    
    if (!this.musicEnabled || !this.audioContext) return

    this.ensureAudioContext()

    // 停止当前音乐
    this.stopMusic()

    try {
      // 创建简单的背景音乐循环
      // 这里使用简单的和弦序列作为背景音乐
      const chords = {
        home: [
          [261.63, 329.63, 392],    // C major
          [293.66, 369.99, 440],    // D major
          [329.63, 415.30, 493.88], // E major
          [261.63, 329.63, 392]     // C major
        ],
        game: [
          [261.63, 329.63, 392],
          [293.66, 369.99, 440]
        ],
        result: [
          [523.25, 659.25, 783.99],
          [587.33, 698.46, 880]
        ]
      }

      const chordSequence = chords[type] || chords.home
      let chordIndex = 0
      this.musicType = type

      const playNextChord = () => {
        // 检查音乐是否仍然启用且类型未改变
        if (!this.musicEnabled || this.musicType !== type) return

        const chord = chordSequence[chordIndex]
        // 使用更低的音量播放背景音乐
        chord.forEach((freq, index) => {
          setTimeout(() => {
            if (this.musicEnabled && this.musicType === type) {
              this.playTone(freq, 1.5, 'sine', this.musicVolume * 0.08)
            }
          }, index * 50)
        })

        chordIndex = (chordIndex + 1) % chordSequence.length
        this.musicTimer = setTimeout(playNextChord, 2500)
      }

      // 延迟开始，避免与音效冲突
      setTimeout(playNextChord, 500)
    } catch (e) {
      console.warn('背景音乐播放失败:', e)
    }
  }

  /**
   * 停止背景音乐
   */
  stopMusic() {
    if (this.musicTimer) {
      clearTimeout(this.musicTimer)
      this.musicTimer = null
    }
    this.musicType = null
  }

  /**
   * 设置音效开关
   */
  setSoundEnabled(enabled) {
    this.soundEnabled = enabled
  }

  /**
   * 设置音效音量
   */
  setSoundVolume(volume) {
    this.soundVolume = Math.max(0, Math.min(1, volume))
  }

  /**
   * 设置音乐开关
   */
  setMusicEnabled(enabled) {
    this.musicEnabled = enabled
    if (!enabled) {
      this.stopMusic()
    }
  }

  /**
   * 设置音乐音量
   */
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume))
  }
}

// 创建单例
export const soundManager = new SoundManager()

export default soundManager
