<template>
  <div class="settings-page">
    <div class="settings-container">
      <!-- 头部 -->
      <div class="page-header">
        <AppButton
          text="← 返回"
          type="secondary"
          size="small"
          @click="goBack"
        />
        <h2 class="page-title">设置</h2>
      </div>

      <!-- 用户信息 -->
      <AppCard title="👤 用户信息" class="section-card">
        <div class="user-info">
          <div class="info-row">
            <span class="info-label">用户名</span>
            <span class="info-value">{{ userStore.userProgress?.userName || '小朋友' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">当前等级</span>
            <span class="info-value">Lv.{{ userStore.level }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">加入时间</span>
            <span class="info-value">{{ formatDate(userStore.userProgress?.createdTime) }}</span>
          </div>
        </div>
      </AppCard>

      <!-- 主题设置 -->
      <AppCard title="🎨 主题设置" class="section-card">
        <ThemeSelector />
      </AppCard>

      <!-- 音效设置 -->
      <AppCard title="🔊 音效设置" class="section-card">
        <div class="setting-item">
          <div class="setting-info">
            <div class="setting-label">开启音效</div>
            <div class="setting-desc">开启答题音效反馈</div>
          </div>
          <label class="switch">
            <input
              type="checkbox"
              v-model="settings.sound.enabled"
              @change="saveSettings"
            />
            <span class="slider"></span>
          </label>
        </div>
        <div class="setting-item" v-if="settings.sound.enabled">
          <div class="setting-info">
            <div class="setting-label">音效音量</div>
            <div class="setting-desc">{{ Math.round(settings.sound.volume * 100) }}%</div>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            v-model.number="settings.sound.volume"
            @change="saveSettings"
            class="volume-slider"
          />
        </div>
      </AppCard>

      <!-- 背景音乐设置 -->
      <AppCard title="🎵 背景音乐设置" class="section-card">
        <div class="setting-item">
          <div class="setting-info">
            <div class="setting-label">开启背景音乐</div>
            <div class="setting-desc">开启背景音乐播放</div>
          </div>
          <label class="switch">
            <input
              type="checkbox"
              v-model="settings.music.enabled"
              @change="saveSettings"
            />
            <span class="slider"></span>
          </label>
        </div>
        <div class="setting-item" v-if="settings.music.enabled">
          <div class="setting-info">
            <div class="setting-label">音乐音量</div>
            <div class="setting-desc">{{ Math.round(settings.music.volume * 100) }}%</div>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            v-model.number="settings.music.volume"
            @change="saveSettings"
            class="volume-slider"
          />
        </div>
      </AppCard>

      <!-- 动画设置 -->
      <AppCard title="✨ 动画设置" class="section-card">
        <div class="setting-item">
          <div class="setting-info">
            <div class="setting-label">开启动画</div>
            <div class="setting-desc">开启页面过渡动画</div>
          </div>
          <label class="switch">
            <input
              type="checkbox"
              v-model="settings.animation.enabled"
              @change="saveSettings"
            />
            <span class="slider"></span>
          </label>
        </div>
      </AppCard>

      <!-- 数据管理 -->
      <AppCard title="💾 数据管理" class="section-card">
        <div class="action-list">
          <AppButton
            text="导出学习数据"
            type="primary"
            icon="📤"
            @click="exportData"
          />
          <AppButton
            text="清除所有数据"
            type="error"
            icon="🗑️"
            @click="clearAllData"
          />
        </div>
      </AppCard>

      <!-- 关于 -->
      <AppCard title="ℹ️ 关于" class="section-card">
        <div class="about-info">
          <div class="about-row">
            <span class="about-label">应用名称</span>
            <span class="about-value">二年级汉字闯关挑战</span>
          </div>
          <div class="about-row">
            <span class="about-label">版本</span>
            <span class="about-value">v1.0.0</span>
          </div>
          <div class="about-row">
            <span class="about-label">开发日期</span>
            <span class="about-value">2025年11月</span>
          </div>
        </div>
      </AppCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { soundManager } from '@/utils/soundManager'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'
import ThemeSelector from '@/components/common/ThemeSelector.vue'

const router = useRouter()
const userStore = useUserStore()

// 状态
const settings = ref({
  sound: { enabled: true, volume: 0.7 },
  music: { enabled: true, volume: 0.5 },
  animation: { enabled: true, speed: 'normal' },
  display: { theme: 'cute', fontSize: 'medium' },
  game: { autoNextQuestion: false, showPinyinHint: true }
})

// 方法
const goBack = () => {
  router.push('/')
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const saveSettings = () => {
  // 更新音效管理器设置
  soundManager.updateSettings(settings.value)
  // 保存到存储
  userStore.updateSettings(settings.value)
}

const exportData = () => {
  userStore.exportData()
}

const clearAllData = () => {
  const success = userStore.clearAllData()
  if (success) {
    alert('数据已清空')
    router.push('/')
  }
}

// 生命周期
onMounted(() => {
  if (userStore.settings) {
    settings.value = { 
      ...userStore.settings,
      // 确保有music设置
      music: userStore.settings.music || { enabled: true, volume: 0.5 }
    }
    // 同步到音效管理器
    soundManager.updateSettings(settings.value)
  }
})
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  padding: 20px;
}

.settings-container {
  max-width: 800px;
  margin: 0 auto;
  animation: slideIn 0.5s ease;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.page-title {
  font-size: var(--font-size-xlarge);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.section-card {
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: var(--radius-small);
}

.info-label {
  font-size: var(--font-size-medium);
  color: var(--text-secondary);
}

.info-value {
  font-size: var(--font-size-medium);
  font-weight: 600;
  color: var(--text-primary);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--bg-secondary);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  flex: 1;
}

.setting-label {
  font-size: var(--font-size-medium);
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.setting-desc {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
}

/* 开关按钮 */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 28px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--success);
}

input:checked + .slider:before {
  transform: translateX(22px);
}

/* 音量滑块 */
.volume-slider {
  width: 150px;
  height: 6px;
  border-radius: 3px;
  background: var(--bg-secondary);
  outline: none;
  -webkit-appearance: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--primary);
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--primary);
  cursor: pointer;
  border: none;
}

.action-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.about-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.about-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: var(--radius-small);
}

.about-label {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
}

.about-value {
  font-size: var(--font-size-small);
  color: var(--text-primary);
}

/* 响应式 */
@media (max-width: 768px) {
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .volume-slider {
    width: 100%;
  }
}
</style>

