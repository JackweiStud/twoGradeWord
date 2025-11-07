<template>
  <div class="app-progress" :style="{ width: size + 'px', height: size + 'px' }">
    <svg :width="size" :height="size" class="progress-svg">
      <!-- 背景圆环 -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        class="progress-bg"
        :stroke-width="strokeWidth"
      />
      <!-- 进度圆环 -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        class="progress-bar"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="progressOffset"
        :style="{ stroke: color }"
      />
    </svg>
    
    <!-- 中心内容 -->
    <div class="progress-content">
      <div class="progress-value">{{ displayValue }}</div>
      <div v-if="label" class="progress-label">{{ label }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 进度值 (0-100)
  value: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0 && value <= 100
  },
  // 圆环大小
  size: {
    type: Number,
    default: 120
  },
  // 线条宽度
  strokeWidth: {
    type: Number,
    default: 8
  },
  // 颜色 (可选，不传则使用主题色)
  color: {
    type: String,
    default: ''
  },
  // 标签文字
  label: {
    type: String,
    default: ''
  },
  // 是否显示百分号
  showPercent: {
    type: Boolean,
    default: true
  },
  // 动画持续时间
  duration: {
    type: Number,
    default: 1000
  }
})

// 计算圆心
const center = computed(() => props.size / 2)

// 计算半径
const radius = computed(() => (props.size - props.strokeWidth) / 2)

// 计算周长
const circumference = computed(() => 2 * Math.PI * radius.value)

// 计算进度偏移量
const progressOffset = computed(() => {
  const progress = Math.min(100, Math.max(0, props.value))
  return circumference.value - (progress / 100) * circumference.value
})

// 显示的值
const displayValue = computed(() => {
  const val = Math.round(props.value)
  return props.showPercent ? `${val}%` : val
})

// 根据进度值自动选择颜色
const progressColor = computed(() => {
  if (props.color) return props.color
  
  if (props.value >= 90) return 'var(--success)'
  if (props.value >= 70) return 'var(--primary)'
  if (props.value >= 50) return 'var(--secondary)'
  return 'var(--error)'
})
</script>

<style scoped>
.app-progress {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.progress-svg {
  transform: rotate(-90deg);
}

.progress-bg {
  fill: none;
  stroke: var(--border-light);
  opacity: 0.3;
}

.progress-bar {
  fill: none;
  stroke: v-bind(progressColor);
  stroke-linecap: round;
  transition: stroke-dashoffset v-bind('duration + "ms"') cubic-bezier(0.4, 0, 0.2, 1),
              stroke v-bind('duration + "ms"') ease;
}

.progress-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.progress-value {
  font-size: calc(v-bind('size + "px"') * 0.25);
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 4px;
}

.progress-label {
  font-size: calc(v-bind('size + "px"') * 0.1);
  color: var(--text-secondary);
  font-weight: 500;
  white-space: nowrap;
}

/* 动画效果 */
@keyframes progress-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.progress-bar {
  animation: progress-pulse 2s ease-in-out infinite;
}
</style>
