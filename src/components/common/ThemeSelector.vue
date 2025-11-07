<template>
  <div class="theme-selector">
    <div class="theme-grid">
      <div
        v-for="theme in themes"
        :key="theme.id"
        class="theme-card"
        :class="{ active: currentThemeId === theme.id }"
        @click="selectTheme(theme.id)"
      >
        <!-- 主题预览色块 -->
        <div class="theme-preview">
          <div
            class="color-block primary"
            :style="{ background: theme.colors.primary }"
          ></div>
          <div
            class="color-block secondary"
            :style="{ background: theme.colors.secondary }"
          ></div>
          <div
            class="color-block bg"
            :style="{ background: theme.colors.bgPrimary }"
          ></div>
        </div>
        
        <!-- 主题信息 -->
        <div class="theme-info">
          <div class="theme-icon">{{ theme.icon }}</div>
          <div class="theme-name">{{ theme.name }}</div>
          <div class="theme-desc">{{ theme.description }}</div>
        </div>
        
        <!-- 选中标记 -->
        <div v-if="currentThemeId === theme.id" class="theme-badge">
          <span class="badge-icon">✓</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/themeStore'
import { soundManager } from '@/utils/soundManager'

const themeStore = useThemeStore()

// 当前主题ID
const currentThemeId = computed(() => themeStore.currentThemeId)

// 所有主题
const themes = computed(() => themeStore.allThemes)

// 选择主题
const selectTheme = (themeId) => {
  if (themeId === currentThemeId.value) return
  
  themeStore.switchTheme(themeId)
  soundManager.play('success')
}
</script>

<style scoped>
.theme-selector {
  width: 100%;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.theme-card {
  position: relative;
  background: var(--bg-card);
  border: 2px solid var(--border);
  border-radius: var(--radius-large);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  overflow: hidden;
}

.theme-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-medium);
  border-color: var(--primary);
}

.theme-card.active {
  border-color: var(--primary);
  box-shadow: var(--shadow-heavy);
  background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-hover) 100%);
}

.theme-card.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
}

/* 主题预览色块 */
.theme-preview {
  display: flex;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
  height: 60px;
  border-radius: var(--radius-medium);
  overflow: hidden;
}

.color-block {
  flex: 1;
  transition: transform var(--transition-normal);
}

.theme-card:hover .color-block {
  transform: scale(1.05);
}

.color-block.primary {
  border-radius: var(--radius-small) 0 0 var(--radius-small);
}

.color-block.bg {
  border-radius: 0 var(--radius-small) var(--radius-small) 0;
}

/* 主题信息 */
.theme-info {
  text-align: center;
}

.theme-icon {
  font-size: var(--font-size-xlarge);
  margin-bottom: var(--spacing-sm);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.theme-name {
  font-size: var(--font-size-medium);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.theme-desc {
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  line-height: 1.4;
}

/* 选中标记 */
.theme-badge {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  width: 28px;
  height: 28px;
  background: var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  animation: badge-pop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes badge-pop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.badge-icon {
  color: var(--text-inverse);
  font-size: var(--font-size-medium);
  font-weight: 700;
}

/* 响应式 */
@media (max-width: 768px) {
  .theme-grid {
    grid-template-columns: 1fr;
  }
  
  .theme-preview {
    height: 50px;
  }
}
</style>
